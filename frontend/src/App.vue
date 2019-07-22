<template>
    <div id="app">
        <router-view/>
        <i class="material-icons grad-logout" @click="$router.push('/logout')">exit_to_app</i>
    </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Oswald|Source+Sans+Pro|Material+Icons');

@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("default", (
  primary: #D18D1F, // The primary color of your brand
  accent: #8F1167, // The secondary color of your brand
  white: white
));

@import "~vue-material/dist/theme/all";

html, body {
    margin: 0px;
    padding: 0px;
    background-color: #F0EEEC;
    font-family: 'Source Sans Pro', sans-serif;
}

.grad-logout {
    position: fixed;
    top: 0px;
    right: 0px;
    margin: 20px;
    opacity: .5;
    transition: opacity 0.1s linear;
    cursor: pointer;

    &:hover {
        opacity: 1;
    }
}
</style>