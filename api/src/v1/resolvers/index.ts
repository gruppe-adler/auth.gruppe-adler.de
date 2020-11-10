import GroupResolver from './group.resolver';
import UserResolver from './user.resolver';
import AuthResolver from './auth.resolver';
import { NonEmptyArray } from 'type-graphql';

export default [ GroupResolver, UserResolver, AuthResolver ] as NonEmptyArray<Function>|NonEmptyArray<string>;
