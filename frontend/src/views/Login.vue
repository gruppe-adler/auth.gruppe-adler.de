<template>
<div class="grad-login">
    <img src="@/assets/adlerkopp.svg" />
    <h3>Grad login</h3>
    <p>Steam gibt uns Deine SteamID und deinen Nick, um Dich zu identifizieren. Wir bekommen  keinen Zugriff auf Deinen Account.</p>

    <a :href="loginSteamRedirectUrl">
        <button>
            <img src="@/assets/steam.svg" />
            <span>Login mit Steam SSO</span>
        </button>
    </a>
</div>
    <!-- <a :href="loginSteamRedirectUrl">
            <img
                src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png"
                alt="Anmeldung via Steam"
            />
    </a> -->
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

<style lang="scss" scoped>
.grad-login {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 0 0 20vh 0 !important;

    > img {
        height: 128px;
        width: 128px;
    }

    >p {
        background-color: #E3E1DF;
        border-radius: 8px;
        padding: 20px 27px;

        color: rgba(#333333, 0.7);
        margin: 24px 0px;
        width: 400px;
    }

    > h3 {
        margin-top: 10px;
        font-size: 30px;
    }
}
</style>
