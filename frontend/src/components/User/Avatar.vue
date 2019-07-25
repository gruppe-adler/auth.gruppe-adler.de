<template>
    <div
        :class="['grad-avatar', isDragging ? 'grad-avatar--drag' : '', canEdit ? 'grad-avatar--editable' : '' ]"
        @click="onClickAvatar"
        @drop="onDropAvatar"
        @dragover="$event.preventDefault()"
    >
        <img :src="img" />
        <i class="material-icons">add_photo_alternate</i>
        <input type="file" multiple="false" accept="image/jpeg, image/png, .gif" ref="avatar_upload" @input="onInputAvatar" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component
export default class AvatarVue extends Vue {
    @Prop({ default: false }) private canEdit!: boolean;
    @Prop({ default: '' }) private img!: string;

    @Prop({ default: '' }) private value!: File|null;
    private get avatar() { return this.value; }
    private set avatar(v: File|null) { this.$emit('input', v); }

    private loading: boolean = false;
    private isDragging: boolean = false;
    private dragTimeOut?: number;

    private created() {
        document.body.addEventListener('dragover', this.onDrag);
    }

    private beforeDestroy() {
        document.body.removeEventListener('dragover', this.onDrag);
    }

    private onDrag() {
        this.isDragging = true;

        if (this.dragTimeOut) clearTimeout(this.dragTimeOut);

        this.dragTimeOut = setTimeout(() => {
            this.isDragging = false;
        }, 100);
    }

    private onClickAvatar() {
        const uploadInput = this.$refs.avatar_upload as HTMLInputElement;
        const res = uploadInput.click();
    }

    private onInputAvatar() {
        const uploadInput = this.$refs.avatar_upload as HTMLInputElement;
        if (!uploadInput.files) return;

        const file = uploadInput.files[0];
        if (!file) return;

        this.avatar = file;
    }

    private onDropAvatar(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        const uploadInput = this.$refs.avatar_upload as HTMLInputElement;

        if (!event.dataTransfer) return;
        uploadInput.files = event.dataTransfer!.files;

        this.onInputAvatar();
    }
}
</script>

<style lang="scss" scoped>
.grad-avatar {
    height: 128px;
    width: 128px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    border-radius: 50%;
    overflow: hidden;

    img {
        max-height: 100%;
        max-width: 100%;
    }

    i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        color: white;
    }

    input {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        // display: none;
    }

    &--drag,
    &--editable:hover  {
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

    &--editable {
        cursor: pointer;
    }
}

</style>