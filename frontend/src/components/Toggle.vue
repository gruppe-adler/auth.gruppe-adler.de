<template>
    <div :class="['grad-toggle', toggleState ? 'grad-toggle--active' : '',  disabled ? 'grad-toggle--disabled' : '']" @click="click"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ToggleVue extends Vue {
    @Prop({ default: false }) private disabled!: boolean;

    @Prop({ default: false }) private value!: boolean;
    get toggleState(): boolean { return this.value; }
    set toggleState(val: boolean) { this.$emit('input', val); }

    private click() {
        if (this.disabled) return;

        this.toggleState = !this.toggleState;
    }
}
</script>

<style lang="scss" scoped>
.grad-toggle {
    width: 34px;
    min-width: 34px;
    height: 14px;
    margin: 3px 0;
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 14px;
    transition: .4s cubic-bezier(.25,.8,.25,1);
    background-color: rgba(0,0,0,.38);
    cursor: pointer;

    &::before {
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
        width: 20px;
        height: 20px;
        position: relative;
        border-radius: 50%;
        transition: .4s cubic-bezier(.25,.8,.25,1);
        background-color: rgb(245, 245, 245);
        content: '';
    }

    &#{&}--active {
        background-color: #97bff6;

        &::before {
            transform: translate3d(15px,0,0);
            background-color: #2F80ED;
        }
    }

    &#{&}--disabled {
        background-color: #dedede;
        cursor: default;

        &::before {
            background-color: #bdbdbd;
        }
    }
}
</style>
