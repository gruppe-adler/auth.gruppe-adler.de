<template>
<div :class="['grad-navbar', flyOutShown ? 'grad-navbar--flyout-shown' : '']">
    <div class="grad-navbar__header">
        <img src="@/assets/adlerkopp.svg" />
        <h3>Grad login</h3>
    </div>
    <div v-if="$root.$data.user && $root.$data.user.admin">
        <router-link tag="button" to="/groups" :class="[groupsNavActive ? 'grad-active' : '']">Gruppen</router-link>
        <router-link tag="button" to="/users" :class="[usersNavActive ? 'grad-active' : '']">Nutzer</router-link>
    </div>
    <span v-else></span>
    <div class="grad-navbar__user" v-if="$root.$data.user" @click="showFlyOut">
        <img :src="`https://sso.gruppe-adler.de/api/avatars/${$root.$data.user.avatar}`" />
        <span>{{$root.$data.user.username}}</span>
        <div v-if="flyOutShown" class="grad-navbar__user-flyout grad-menu">
            <router-link tag="span" to="/user/me">Profil</router-link>
            <router-link tag="span" to="/logout">Ausloggen</router-link>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class NavbarVue extends Vue {
    private flyOutShown: boolean = false;

    private get groupsNavActive() {
        return this.$route.path === '/groups';
    }

    private get usersNavActive() {
        return this.$route.path === '/users';
    }

    private showFlyOut() {
        if (this.flyOutShown) {
            this.flyOutShown = false;
            return;
        }

        this.flyOutShown = true;
        window.setTimeout(() => window.addEventListener('click', this.onClick), 100);
    }

    private onClick(event: MouseEvent) {
        this.flyOutShown = false;
        window.removeEventListener('click', this.onClick);

        event.stopPropagation();
    }
}
</script>

<style lang="scss" scoped>
.grad-navbar {
    flex: 0;
    display: grid;
    padding: 20px;
    align-items: center;
    width: 100%;
    grid-template-columns: .5fr 600px .5fr;
    justify-items: flex-start;
    box-sizing: border-box;

    @media (max-width: 800px) {
        grid-template-columns: auto 1fr auto;
        padding: 10px;
    }

    > * {
        display: grid;
        grid-column-gap: 8px;
        grid-template-columns: auto auto;
        align-items: center;
    }

    &__header {
        display: grid;
        grid-column-gap: 8px;
        grid-template-columns: auto auto;
        align-items: center;

        @media (max-width: 800px) {
            display: none;
        }

        img {
            height: 30px;
        }
    
        h3 {
            font-size: 16px;
            opacity: 0.5;
        }   
    }


    &__user {
        position: relative;
        justify-self: flex-end;
        cursor: pointer;
        border-radius: 20px;

        display: flex;
        align-items: center;
        transition: background-color linear 0.1s;

        > img {
            height: 40px;
            width: 40px;
            border-radius: 50%;
            z-index: 1;
            object-fit: cover;
        }

        > span {
            color: #333333;
            box-sizing: border-box;
            padding: 10px 16px;
            padding-left: 30px;
            margin-left: -20px;
            height: 40px;
        }

        &:hover {
            background-color: rgba(255, 255, 255, 0.5);
        }

        &-flyout {
            position: absolute;
            top: calc(100% + 6px);
            right: 0px;
        }
    }

    &--flyout-shown {
        .grad-navbar__user {
            background-color: rgba(255, 255, 255, 0.5);
        }
    }
}
</style>

