<template>
    <div :class="['grad-profile', canEdit ? 'grad-profile--editable' : '']">
        <template v-if="user">
            <div class="grad-profile__avatar">
                <img :src="user.avatar" />
                <i class="material-icons">add_photo_alternate</i>
            </div>
            <div style="display: flex;">
                <Toggle v-model="user.admin" :disabled="!$root.$data.user.admin" />
                <label style="margin: 0px 10px;">Admin</label>
            </div>
            <div class="grad-profile__username">
                <input type="text" v-model="user.username" :disabled="!canEdit" />
                <a target="_blank" :href="`https://steamcommunity.com/profiles/${user.steamId}`">
                    <img src="~@/assets/steam.svg" />
                </a>
            </div>
            <span v-if="errorMessages.username" class="grad-label-error">{{ errorMessages.username }}</span>
            <Groups
                v-model="user.groups"
                :primaryGroup="user.primaryGroup"
                :disabled="!$root.$data.user.admin"
                @select="selectGroup"
            />
            <button 
                v-if="canEdit"
                :disabled="originalUser === JSON.stringify(user)"
                @click="onClickSave"
                class="grad-profile__save"
            >
                Speichern
            </button>
            <button
                v-if="canEdit"
                @click="onClickDelete"
                class="grad-profile__delete"
            >
                Löschen
            </button>
            <Modal v-model="deleteModal" @submit="deleteUser" type="warn">
                Bist du dir sicher, dass du den Nutzer {{user.username}} löschen möchtest?
                <br />
                Diese Aktion kann nicht Rückgängig gemacht werden!
            </Modal>
        </template>
        <Loader v-if="loading" />
        <!-- TODO: Show Error -->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { User, Group } from '@/models';
import { authenticate, fetchUser, updateUser, deleteUser, fetchGroups } from '@/services';
import ToggleVue from '@/components/Toggle.vue';
import ModalVue from '@/components/Modal.vue';
import LoaderVue from '@/components/Loader.vue';
import GroupsVue from '@/components/User/Groups.vue';
@Component({
    components: {
        Toggle: ToggleVue,
        Modal: ModalVue,
        Loader: LoaderVue,
        Groups: GroupsVue,
    }
})
export default class ProfileVue extends Vue {
    @Prop({ default: '' }) private uid!: string;

    private errorMessages: { [index: string]: string } =  {
        username: ''
    };
    private error: any = null;
    private deleteModal: boolean = false;
    private loading: boolean = false;
    private user?: User|null = null;
    private originalUser: string = '';

    private get canEdit() {
        if (! this.user) return false;

        if (! this.$root.$data.user) return false;

        return this.$root.$data.user.admin || this.$root.$data.user.id === this.user.id;
    }

    private created() {
        this.fetchUser();
    }

    @Watch('uid')
    private async fetchUser() {
        this.loading = true;

        if (this.uid.toLowerCase() !== 'me') {
            const uid = Number.parseInt(this.uid, 10);

            if (Number.isNaN(uid)) return;

            try {
                this.user = await fetchUser(uid);
            } catch (err) {
                this.error = err;
            }
        } else {
            try {
                this.user = await authenticate();
            } catch (err) {
                this.$router.push('/login');
                return;
            }
        }

        this.loading = false;
        this.originalUser = JSON.stringify(this.user);
    }

    private onClickDelete() {
        if (!this.user) return;

        this.deleteModal = true;
    }

    private onClickSave() {
        if (!this.user) return;

        this.updateUser();
    }

    private selectGroup(group: Group) {
        this.user!.primaryGroup = group;
    }

    private async extractErrors(res: Response) {

        // we wont handle errors other than 422 any special
        if (res.status !== 422) return this.error = res;

        // get body
        const body: Array<{ param: string, msg: string }> = await res.json();

        // collect all erros of the same field in an array
        const errors: { [index: string]: string[] } = {};
        body.forEach(err => {
            if (!errors.hasOwnProperty(err.param)) errors[err.param] = [];

            errors[err.param].push(err.msg);
        });

        // join all errors of each field
        for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
                this.errorMessages[key] = errors[key].join(', ');
            }
        }
    }

    /**
     * Update the group
     */
    private async updateUser() {
        this.loading = true;

        try {
            await updateUser(this.user!);

            if (this.uid.toLowerCase() === 'me') {
                this.$router.push('/login');
            } else {
                this.$router.push('/users');
            }
        } catch (err) {
            this.extractErrors(err as Response);
        }
        this.loading = false;

    }

    /**
     * Delete the group
     */
    private async deleteUser() {
        this.loading = true;

        try {
            await deleteUser(this.user!.id);

            if (this.user!.id === this.$root.$data.user.id) {
                this.$router.push('/login');
            } else {
                this.$router.push('/users');
            }
        } catch (err) {
            this.error = err;
        }
        this.loading = false;

    }
}
</script>

<style lang="scss" scoped>
.grad-profile {
    flex: 1;
    width: 500px;

    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto !important;

    > * {
        margin-top: 12px;
        margin-bottom: 12px;
        flex-shrink: 0;
    }

    button {
        width: 50%;
    }

    &__avatar {
        height: 128px;
        width: 128px;
        position: relative;
        user-select: none;
        border-radius: 50%;
        overflow: hidden;

        img {
            height: 100%;
            height: 100%;
        }

        i {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            color: white;
        }
    }

    &__username {
        width: 100%;
        position: relative;

        > a {
            position: absolute;
            right: 15px;
            top: 15px;
            cursor: pointer;
            height: calc(100% - 30px);

            > img {
                height: 100%;
                filter: saturate(0%);
            }

            &:hover {
                opacity: 1;
            }
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

.grad-profile.grad-profile--editable {
    .grad-profile__avatar {
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