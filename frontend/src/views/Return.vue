<template>
<div class="grad-return">
    <Spinner :diameter="100" />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import SpinnerVue from '@/components/Spinner.vue';

import { logIn } from '@/services';

@Component({
    components: {
        Spinner: SpinnerVue
    }
})
export default class ReturnVue extends Vue {
    private mounted() {
        this.logIn();
    }

    private async logIn() {
        try {
            await logIn(process.env.BASE_URL + this.$route.fullPath);
        } catch (err) {
            // TODO: Catch errors
            return;
        }

        this.$router.push('/redirect');
    }
}
</script>

<style lang="scss" scoped>
.grad-return {
    position: fixed;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>