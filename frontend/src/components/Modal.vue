<template>
    <div :class="['grad-modal', `grad-modal--${type}`]" v-if="shown">
        <div class="grad-modal__mask"></div>
        <div class="grad-modal__wrapper">
            <p><slot /></p>
            <div>
                <button @click="$emit('cancel'); shown=false;">Abbrechen</button>
                <button @click="$emit('submit'); shown=false;">{{buttonText}}</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ModalVue extends Vue {
    @Prop({ default: 'Bestätigen' }) public buttonText!: string;
    @Prop({ default: 'normal' }) public type!: string;

    @Prop({ default: false }) public value!: boolean;
    get shown(): boolean { return this.value; }
    set shown(val: boolean) { this.$emit('input', val); }

}
</script>

<style lang="scss" scoped>
.grad-modal {
    position: fixed;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    display: flex; 
    align-items: center;
    justify-content: center;

    &__wrapper {
        background-color: white;
        border-radius: 5px;
        box-shadow: 0 3px 3px -2px rgba(0,0,0,.2), 0 3px 4px 0 rgba(0,0,0,.14), 0 1px 8px 0 rgba(0,0,0,.12);
        z-index: 1000;
        width: 500px;

        > p {
            padding: 20px;
            font-size: 18px;
            font-weight: 600;
        }

        > div {
            display: flex;
            justify-content: flex-end;

            > button {
                
                &:not(:hover) {
                    background-color: transparent;
                }

                margin: 5px;
            }
        }
    }
    &__mask {
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background-color: rgba(#F0EEEC, 0.7);
    }

    &--warn {
        button:last-child {
            color: #8F1167;
            background-color: transparent;

            &:hover {
                background-color: #8F1167;
                color: white;
            }
        }
    }
}
</style>
