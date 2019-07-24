<template>
    <div class="app">
        <Navbar v-if="navbarShown" />
        <router-view v-if="routerViewShown" class="page"/>
        <div v-else class="page">
            <Loader />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import NavbarVue from '@/components/Navbar.vue';
import { authenticate } from '@/services';
import LoaderVue from '@/components/Loader.vue';

@Component({
    components: {
        Navbar: NavbarVue,
        Loader: LoaderVue
    }
})
export default class AppVue extends Vue {
    private authFetching: boolean = false;

    get navbarShown() {
        return !(['/login'].includes(this.$route.path));
    }

    get routerViewShown() {
        return !this.$route.meta.requiresAuth || this.$root.$data.user;
    }

    @Watch('$route')
    private async authenticateUser() {
        if (this.authFetching) return;
        this.authFetching = true;

        const path = this.$route.path;

        try {
            this.$root.$data.user = await authenticate();
        } catch (err) {

            // redirect to login page if user authentification is needed
            if (this.$route.meta.requiresAuth) this.$router.push('/login');

            return;
        }

        if (this.$route.meta.requiresAdmin && !this.$root.$data.user.admin) this.$router.push('/403');

        this.authFetching = false;
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
        margin: auto 0px;
        padding: 0px 10px;
        max-width: calc(100% - 20px);
        overflow-y: hidden;
        overflow-x: visible;
    }
}
</style>


<style lang="scss" src="./global.scss"></style>