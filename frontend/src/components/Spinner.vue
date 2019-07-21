<template>
    <svg
        class="grad-spinner"
        :viewBox="`0 0 66 66`"
        :width="diameter"
        :height="diameter"
    >
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SpinnerVue extends Vue {
    @Prop({ default: 60 }) private diameter!: number;
}
</script>

<style lang="scss" scoped>

$offset: 187;
$duration: 1.4s;

.grad-spinner {
    animation: rotator $duration linear infinite;
}

@keyframes rotator {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(270deg); }
}

.path {
    stroke-dasharray: $offset;
    stroke-dashoffset: 0;
    transform-origin: center;
    stroke: #d18d1f;
    animation: dash $duration ease-in-out infinite, 
}

@keyframes dash {
    0% { stroke-dashoffset: $offset; }
    50% {
        stroke-dashoffset: $offset/4;
        transform:rotate(135deg);
    }
    100% {
        stroke-dashoffset: $offset;
        transform:rotate(450deg);
    }
}
</style>