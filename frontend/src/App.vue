<template>
<div>
    <Navbar />
    <router-view/>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Navbar from '@/components/TheNavbar.vue';

@Component({
    components: {
        Navbar
    }
})
export default class App extends Vue {}
</script>


<style lang="scss">
@import url('./global.scss')
</style>
