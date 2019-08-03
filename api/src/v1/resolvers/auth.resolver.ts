import { Resolver, Query, Args, Mutation, Ctx } from 'type-graphql';
import { GroupSchema, UserSchema } from '../schemas';
import { Group, User } from '../../models';
import DeleteGroupArgs from './args/group/deleteGroup.args';
import { Response } from 'express';
import { GradRequest } from '../../@types/GradRequest';
import CookieService from '../../utils/CookieService';
import { JwtService } from '../../utils/JwtService';
import LoginArgs from './args/auth/login.args';
import Steam, { getUserInfo } from '../../utils/Steam';
import * as rp from 'request-promise-native';
import { Response as RpResponse } from 'request';
import { AvatarService } from '../../utils/AvatarService';
import { GraphQLError } from 'graphql';
import { Context } from '../../@types/Context';

@Resolver()
export default class AuthResolver {

    // Steam login url
    @Query(returns => String, { nullable: true })
    public async loginUrl(): Promise<string> {

        let result: string;
        try {
            result = await new Promise<string>((resolve, reject) => {
                Steam.authenticate('https://steamcommunity.com/openid', false, (err, url) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(url);
                    }
                });
            });
        } catch (err) {
            throw new GraphQLError('Error authenticating against Steam');
        }

        return result;
    }

    // login
    @Mutation(returns => String, { nullable: true })
    public async login(@Args() { url }: LoginArgs, @Ctx() context: Context): Promise<string> {

        interface AssertionResult {
            authenticated: boolean;
            claimedIdentifier?: string;
        }

        let result: AssertionResult;
        try {
            result = await new Promise<AssertionResult>((resolve, reject) => {
                Steam.verifyAssertion(url, (err, assertionRes) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(assertionRes);
                    }
                });
            });
        } catch (err) {
            throw new GraphQLError('Negative Assertion');
        }

        if (!result.authenticated || !result.claimedIdentifier) throw new GraphQLError('Negative Assertion');

        const steamId = result.claimedIdentifier.substr('https://steamcommunity.com/openid/id/'.length);

        // find the corresponding user
        let user: User|null = await User.findOne({ where: { steamId }});

        // no user with given steam id exists -> create a new one
        if (!user) {
            const steamUser = await getUserInfo(steamId);

            // fetch avatar
            const steamAvatarPromise = rp.get({
                url: steamUser.avatarfull,
                encoding: null,
                resolveWithFullResponse: true
            });

            // make sure no user with same username exists
            let username = steamUser.personaname;
            let counter = 1;
            let userWithUserName: User|null = null;
            while (userWithUserName) {
                userWithUserName = await User.findOne({ where: { username }});
                username = `${steamUser.personaname}${counter++}`;
            }

            // set first user automatically as admin
            const usersCount = await User.count();

            // wait on avatar request
            let steamAvatar: RpResponse;
            try {
                steamAvatar = await steamAvatarPromise;
            } catch (err) { /* TODO: Catch error */ }

            const avatar = AvatarService.saveImage(steamAvatar.body, steamAvatar.headers['content-type']);

            user = await User.create({ steamId, username, avatar, admin: usersCount === 0 });
        }

        const token = JwtService.sign(user);

        // renew cookie
        CookieService.attachCookie(context.response, token);

        return token;
    }

    // authenticate
    @Mutation(returns => UserSchema, { nullable: true })
    public async authenticate(@Ctx() context: Context): Promise<UserSchema> {

        if (!context.request.gradUser) return null;

        const token = JwtService.sign(context.request.gradUser);

        // renew cookie
        CookieService.attachCookie(context.response, token);

        return context.request.gradUser;
    }

    // logout
    @Mutation(returns => Boolean)
    public async logout(@Ctx() context: Context): Promise<boolean> {

        CookieService.clearCookie(context.response);

        return true;
    }

}
