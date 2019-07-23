<template>
    <div class="app">
        <Navbar v-if="navbarShown" />
        <router-view v-if="routerViewShown" class="page"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import NavbarVue from '@/components/Navbar.vue';
import { authenticate } from '@/services';

@Component({
    components: {
        Navbar: NavbarVue
    }
})
export default class AppVue extends Vue {
    get navbarShown() {
        return !(['/login'].includes(this.$route.path));
    }

    get routerViewShown() {
        return this.$root.$data.user || ['/login', '/openid/return/steam', '/profile'].includes(this.$route.path);
    }

    private created() {
        this.fetchUser();
    }

    @Watch('$route')
    private async fetchUser() {
        if (this.$root.$data.user) return;

        try {
            const user = await authenticate();

            this.$root.$data.user = user;
        } catch (err) { /* intentionally empty. the user is not logged in if we get an error */ }

    }
}
</script>

<style lang="scss" scoped>
.app {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 50px;
    box-sizing: border-box;

    > .page {
        margin: auto 10px;
        max-width: calc(100% - 20px);
        overflow-y: hidden;
        overflow-x: visible;
    }
}
</style>


<style lang="scss" src="./global.scss"></style>