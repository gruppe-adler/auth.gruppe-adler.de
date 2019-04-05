<template>
    <div class="grad-login">
        <div class="grad-login__mask">
            <img class="grad-login__logo" src="/logo.svg" alt="logo" />
            <input v-model="username" class="grad-login__input" type="text" placeholder="Username">
            <input v-model="password" class="grad-login__input" type="password" placeholder="Password">
            <button class="grad-login__button" :disabled="buttonDisabled">Login</button>
            <p>Don't have an account? <router-link to="/">REGISTER</router-link></p>
        </div>
    </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
    private username: string = '';
    private password: string = '';

    get buttonDisabled() {
        return this.username === '' || this.password === '';
    }
}
</script>


<style lang="scss" scoped>
.grad-login {
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__mask {
        background-color: white;
        border-radius: 4px;
        box-shadow: 0 4px 60px rgba(0,0,0,.25);
        
        width: 500px;
        max-width: 100vw;
        
        margin: 10px;
        padding: 50px 50px;

        display: flex;
        flex-direction: column;
        align-items: center;

        
        >*:not(:last-child) {
            margin-bottom: 30px;
        }
    }

    &__logo {
        width: 50%;
    }

    &__input {
        outline: none;
        width: 100%;
        padding: 10px;
        border: none;
        border-bottom: 2px solid rgba(0,0,0,0.1);
        font-size: 1.3em;
        transition: border-bottom-color .3s;

        &:focus {
            border-bottom-color: #d18d1f;
        }
    }

    &__button {
        color: white;
        background-color: #d18d1f;
        border: none;
        border-radius: calc(1.3em + 5px);

        font-size: 1.3em;
        font-weight: bold;
        
        width: 100%;
        height: 1.3em;
        padding: 10px;
        box-sizing: content-box;
        letter-spacing: .1em;
        transition: opacity .3s;

        &:disabled {
            opacity: 0.5;
        }
    }

    p {
        width: 100%;
        text-align: right;
        margin: 0;
        color: rgba(0,0,0,0.5)
    }

    a {
        color: #d18d1f;
        margin-left: .3em;
        font-weight: bold;
        text-decoration: none;
    }
}
</style>
