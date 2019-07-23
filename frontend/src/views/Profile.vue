<template>
    <div :class="['grad-profile', canEdit ? 'grad-profile--editable' : '']" v-if="user">
        <div class="grad-profile__avatar">
            <img :src="user.avatar" />
            <i class="material-icons">add_photo_alternate</i>
        </div>
        <div style="display: flex;">
            <Toggle v-model="user.admin" :disabled="!$root.$data.user.admin" />
            <label style="margin: 0px 10px;">Admin</label>
        </div>
        <div class="grad-profile__username">
            <input type="text" :value="user.username" :disabled="!canEdit" />
            <a target="_blank" :href="`https://steamcommunity.com/profiles/${user.steamId}`">
                <img src="~@/assets/steam.svg" />
            </a>
        </div>
        <button v-if="canEdit" class="grad-profile__save">Speichern</button>
        <button v-if="canEdit" class="grad-profile__delete">Löschen</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { User } from '@/models';
import { authenticate, fetchUser } from '@/services';
import ToggleVue from '@/components/Toggle.vue';
@Component({
    components: {
        Toggle: ToggleVue
    }
})
export default class ProfileVue extends Vue {
    @Prop() private uid?: number;

    private error: any = null;
    private user?: User|null = null;
    private get canEdit() {
        if (! this.user) return false;

        // @ts-ignore
        if (! this.$root.user) return false;

        // @ts-ignore
        return this.$root.user!.admin || this.$root.user!.id === this.uid;
    }

    private created() {
        this.fetchUser();
    }

    @Watch('uid')
    private async fetchUser() {
        if (this.uid) {
            try {
                this.user = await fetchUser(this.uid);
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
        user-select: none;
        border-radius: 50%;
        overflow: hidden;

        img {
            width: 100%;
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
            opacity: 0.5;
            cursor: pointer;
            height: calc(100% - 30px);

            > img {
                height: 100%;
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