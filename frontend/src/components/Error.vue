<template>
    <div class="grad-error">
        <img src="@/error/generic.svg" />
        <p v-if="text">{{text}}</p>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ErrorVue extends Vue {
    @Prop() private text?: string;
}
</script>

<style lang="scss" scoped>
.grad-error {
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
}
</style>
