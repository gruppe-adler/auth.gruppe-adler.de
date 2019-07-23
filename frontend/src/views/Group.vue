<template>
    <div :class="['grad-group']" v-if="group">
        <div class="grad-group__avatar" :style="`color: ${group.color}`" @click.self="pickerShown=true">
            <div class="grad-group__color-picker-mask" v-if="pickerShown" @click="pickerShown=false"></div>
            <ColorPicker
                @click.stop="true;"
                v-if="pickerShown"
                class="grad-group__color-picker"
                theme="dark"
                :color="group.color"
                :sucker-hide="true"
                @changeColor="changeColor"
            />
        </div>
        <input type="text" :value="group.label" />
        <input type="text" :value="group.tag" />
        <button class="grad-group__save">Speichern</button>
        <button class="grad-group__delete" v-if="group.id !== -1">Löschen</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Group } from '@/models';
import { fetchGroup } from '@/services';

// @ts-ignore
import ColorPickerVue from '@caohenghu/vue-colorpicker';

@Component({
    components: {
        ColorPicker: ColorPickerVue
    }
})
export default class GroupVue extends Vue {
    @Prop() private gid?: number;
    private pickerShown: boolean = false;

    private error: any = null;
    private group?: Group|null = null;

    private created() {
        this.fetchGroup();
    }

    @Watch('gid')
    private async fetchGroup() {
        if (this.gid) {
            try {
                this.group = await fetchGroup(this.gid);
            } catch (err) {
                this.error = err;
            }
        } else {
            const label = this.$route.query.label as string || '';

            const tag = label.toLowerCase().replace(/ /g, '_');

            this.group = {
                id: -1,
                tag,
                label,
                color: '#AAAAAA'
            };
        }
    }

    private changeColor(color: { rgba: { toHexString: () => string }}) {
        this.group!.color = color.rgba.toHexString();
    }
}
</script>

<style lang="scss" scoped>
.grad-group {
    // don't ask me why, but overflow-x won't work unless this is set
    overflow-y: visible !important;

    flex: 1;
    width: 500px;

    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
        margin-top: 12px;
        margin-bottom: 12px;
    }

    button {
        width: 50%;
    }

    &__avatar {
        height: 128px;
        width: 128px;
        position: relative;
        display: inline-flex;
        border-radius: 50%;
        background-color: currentColor;
    }

    &__color-picker {
        position: absolute;
        top: 0;
        left: calc(100% + 5px);

        &-mask {
            position: fixed;
            top: 0px;
            left: 0px;
            width: 100vw;
            height: 100vh;
        }
    }

    &__save {
        margin-top: auto;
    }

    &__delete {
        color: #8F1167;
        background-color: transparent;

        &:hover {
            background-color: #8F1167;
            color: white;
        }
    }
}

.grad-group.grad-group--editable {
    .grad-group__avatar {
        cursor: pointer;

        &:hover {
            &::before {
                position: absolute;
                display: block;
                content: '';
                background-color: rgba(0,0,0,0.4);
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
            }
        
            > i {
                display: block;
            }
        }
    }
}

</style>