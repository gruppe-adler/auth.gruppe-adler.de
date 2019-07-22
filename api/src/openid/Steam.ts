import * as rp from 'request-promise';

// @ts-ignore
import { RelyingParty } from 'openid';

const config = require('../../config/config.json');


// @ts-ignore
export default new RelyingParty(
    config.steam.returnUrl, // Return URL
    config.steam.realm, 
    true, // Use stateless verification
    false, // Strict mode
    [] // List of extensions to enable and include
);

export interface SteamUser {
    steamid: string;
    personaname: string;
    avatarfull: string;
}

/**
 * Retrieves infos of steam user
 * @param {string} steamId Steam id
 * @returns {Promise<SteamUser>} steam user
 */
export const getUserInfo = async (steamId: string): Promise<SteamUser> => {
    
    let response: { response: { players: SteamUser[] }} = { response: { players: [] }};
    
    try {
        response = await rp(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?steamids=${steamId}&key=${config.steam.apiKey}`);

        if (typeof response === 'string') response = JSON.parse(response);
    } catch (err) {
        throw err;
    }

    if (response.response.players.length === 0) throw { message: 'Steam user not found', status: 500 };

    return response.response.players[0];
};

