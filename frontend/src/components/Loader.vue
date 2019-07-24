<template>
    <div class="grad-loader">
        <Spinner />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SpinnerVue from '@/components/Loader/Spinner.vue';

@Component({
    components: {
        Spinner: SpinnerVue
    }
})
export default class LoaderVue extends Vue {}
</script>

<style lang="scss" scoped>
.grad-loader {
    position: absolute;
    background-color: rgba(#F0EEEC, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    z-index: 1000;
    animation: appearAfterDelay .5s;
}

@keyframes appearAfterDelay {
  0% { opacity: 0; }
  99% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
