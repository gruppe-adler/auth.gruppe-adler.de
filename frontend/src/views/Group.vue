<template>
    <div class="grad-group" >
        <template v-if="group">
            <div class="grad-group__avatar" :style="`color: ${group.color}`" @click.self="pickerShown=true">
                <span>{{group.label.charAt(0)}}</span>
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
            <div style="display: flex;">
                <Toggle v-model="group.hidden" />
                <label style="margin: 0px 10px;">Versteckt</label>
            </div>
            <div class="grad-icon-input">
                <i class="material-icons">label</i>
                <input type="text" v-model="group.label" />
            </div>
            <div class="grad-icon-input">
                <i class="material-icons">vpn_key</i>
                <input type="text" v-model="group.tag" />
            </div>
            <button class="grad-group__save" :disabled="originalGroup === JSON.stringify(group)" @click="onClickSave">Speichern</button>
            <button v-if="group.id !== -1" class="grad-group__delete" @click="onClickDelete">Löschen</button>
            <Modal v-model="deleteModal" @submit="deleteGroup" type="warn">
                Bist du dir sicher, dass du die Gruppe <span :style="`color: ${group.color}; font-size: inherit;`">{{group.label}}</span> löschen möchtest?
                <br />    
                Diese Aktion kann nicht Rückgängig gemacht werden!    
            </Modal>
        </template>
        <Loader v-if="loading"/>
        <!-- TODO: Show Error -->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Group } from '@/models';
import { fetchGroup, createGroup, updateGroup, deleteGroup } from '@/services';

// @ts-ignore
import ColorPickerVue from '@caohenghu/vue-colorpicker';
import LoaderVue from '@/components/Loader.vue';
import ModalVue from '@/components/Modal.vue';
import ToggleVue from '@/components/Toggle.vue';

@Component({
    components: {
        ColorPicker: ColorPickerVue,
        Loader: LoaderVue,
        Modal: ModalVue,
        Toggle: ToggleVue
    }
})
export default class GroupVue extends Vue {
    @Prop() private gid?: number;

    private loading: boolean = false;
    private pickerShown: boolean = false;
    private deleteModal: boolean = false;
    private originalGroup: string = '';

    private error: any = null;
    private group?: Group|null = null;

    private created() {
        this.fetchGroup();
    }

    @Watch('gid')
    private async fetchGroup() {
        this.loading = true;
        if (this.gid) {
            try {
                this.group = await fetchGroup(this.gid);
            } catch (err) {
                this.error = err;
            }

            this.originalGroup = JSON.stringify(this.group);
        } else {
            const label = this.$route.query.label as string || '';

            this.group = {
                id: -1,
                tag: label,
                label,
                color: '#D18D1F',
                hidden: false
            };
        }
        this.loading = false;
    }

    private changeColor(color: { rgba: { toHexString: () => string }}) {
        this.group!.color = color.rgba.toHexString();
    }

    @Watch('group.tag')
    private validateTag() {
        this.group!.tag = this.group!.tag
            .toLowerCase()
            .replace(/ /ig, '_')
            .replace(/ä/ig, 'ae')
            .replace(/ö/ig, 'oe')
            .replace(/ü/ig, 'ue')
            .replace(/[^(\w|\-)]/ig, '');
    }

    private async onClickSave() {
        if (!this.group) return;

        if (this.group.id === -1) {
            this.createGroup();
        } else {
            this.updateGroup();
        }
    }

    private onClickDelete() {
        if (!this.group) return;

        this.deleteModal = true;
    }

    /**
     * Create the group
     */
    private async createGroup() {
        this.loading = true;

        try {
            await createGroup(this.group!);
        } catch (err) {
            this.error = err;
        }
        this.loading = false;
        this.$router.push('/groups');
    }

    /**
     * Update the group
     */
    private async updateGroup() {
        this.loading = true;

        try {
            await updateGroup(this.group!);
        } catch (err) {
            this.error = err;
        }
        this.loading = false;
        this.$router.push('/groups');
    }

    /**
     * Delete the group
     */
    private async deleteGroup() {
        this.loading = true;

        try {
            await deleteGroup(this.group!.id);
        } catch (err) {
            this.error = err;
        }
        this.loading = false;
        this.$router.push('/groups');
    }
}
</script>

<style lang="scss" scoped>
.grad-group {
    overflow-y: auto !important;
    flex: 1;
    width: 500px;
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    > * {
        margin-top: 12px;
        margin-bottom: 12px;
        flex: none;
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
        cursor: pointer;
        user-select: none;

        > span {
            font-size: 40px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            pointer-events: none;
        }
    }

    &__color-picker {
        position: absolute;
        top: 0;
        left: calc(70%);

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

</style>