<template>
<div>
    <img src="@/assets/error/404.svg" width="400" />
    <h2>Scheint so als ob du dich verlaufen hast.</h2>
    <router-link to="/">Hier gehts zurück zur Startseite</router-link>
</div>
</template>

<style lang="scss" scoped>
div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

h2 {
    margin: 20px;
    text-align: center;
    line-height: 1.2em;
}

a {
    color: #d18d1f;
    text-decoration: underline !important;
    font-size: 1.5em;
}
</style>
