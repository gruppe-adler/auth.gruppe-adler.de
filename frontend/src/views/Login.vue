<template>
    <a :href="loginSteamRedirectUrl">
            <img
                src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png"
                alt="Anmeldung via Steam"
            />
    </a>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoginVue extends Vue {
    private get loginSteamRedirectUrl() {
        const params = new URLSearchParams();

        params.append('openid.mode', 'checkid_setup');
        params.append('openid.ns', 'http://specs.openid.net/auth/2.0');
        params.append('openid.identity', 'http://specs.openid.net/auth/2.0/identifier_select');
        params.append('openid.claimed_id', 'http://specs.openid.net/auth/2.0/identifier_select');
        params.append('openid.return_to', `http://localhost:8080/openid/return/steam`);
        // params.append('openid.realm', 'https://gruppe-adler.de');

        // console.log(`https://steamcommunity.com/openid/login?${params.toString()}`);

        return `https://steamcommunity.com/openid/login?${params.toString()}`;
    }
}
</script>

