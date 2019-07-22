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
import { authenticate } from '../services';

@Component
export default class LoginVue extends Vue {
    private created() {
        this.saveRedirectTo();
        this.checkIfAlreadyLoggedIn();
    }

    private saveRedirectTo() {
        const qname = 'redirect_after_login';
        const query = this.$route.query;

        if (! query[qname]) return;

        // extract redirect_after_login query
        let redirectQuery: string | null;
        if (! Array.isArray(query[qname])) {
            // @ts-ignore
            redirectQuery = query[qname];
        } else {
            redirectQuery = query[qname][0];
        }

        if (redirectQuery === null) return;

        sessionStorage.setItem('grad-sso-redirect-after-login', decodeURIComponent(redirectQuery));
    }

    private async checkIfAlreadyLoggedIn() {
        try {
            await authenticate();
            this.$router.push('/redirect');
        } catch (err) { /* intentionally empty. the user is not logged in if we get an error */ }
    }

    private get loginSteamRedirectUrl() {
        const params = new URLSearchParams();

        params.append('openid.mode', 'checkid_setup');
        params.append('openid.ns', 'http://specs.openid.net/auth/2.0');
        params.append('openid.identity', 'http://specs.openid.net/auth/2.0/identifier_select');
        params.append('openid.claimed_id', 'http://specs.openid.net/auth/2.0/identifier_select');
        params.append('openid.return_to', `http://test.gruppe-adler.de:8080/openid/return/steam`);

        return `https://steamcommunity.com/openid/login?${params.toString()}`;
    }
}
</script>

