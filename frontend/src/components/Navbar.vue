<template>
<div :class="['grad-navbar', flyOutShown ? 'grad-navbar--flyout-shown' : '']">
    <img src="@/assets/adlerkopp.svg" />
    <h3>Grad login</h3>
    <!-- TODO: Fetch user -->
    <div class="grad-navbar__user" v-if="$root.$data.user" @click="showFlyOut">
        <img :src="$root.$data.user.avatar" />
        <span>{{$root.$data.user.username}}</span>
        <div v-if="flyOutShown" class="grad-navbar__user-flyout grad-menu">
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
    display: flex;
    padding: 20px;
    align-items: center;
    justify-content: flex-start;
    width: 100vw;
    box-sizing: border-box;

    > img {
        margin-left: 0px;
        height: 24px;
    }

    h3 {
        font-size: 16px;
        margin-left: 8px;
        opacity: 0.5;
    }


    &__user {
        margin-left: auto;
        position: relative;
        cursor: pointer;

        display: flex;
        align-items: center;

        > img {
            height: 40px;
            border-radius: 50%;
        }

        > span {
            color: #333333;
            box-sizing: border-box;
            margin-left: 8px;
            padding: 10px 16px;
            border-radius: 20px;
            height: 40px;
            transition: background-color linear 0.1s;

            &:hover {
                background-color: rgba(255, 255, 255, 0.5);
            }
        }

        &-flyout {
            width: 100%;
            position: absolute;
            top: calc(100% + 6px);
            left: 0px;



        }
    }

    &--flyout-shown {
        .grad-navbar__user > span {
            background-color: rgba(255, 255, 255, 0.5);
        }
    }
}
</style>

