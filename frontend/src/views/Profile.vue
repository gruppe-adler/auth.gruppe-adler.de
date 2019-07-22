<template>
    <div :class="['grad-profile', canEdit ? 'grad-profile--editable' : '']">
        <div v-if="user" class="grad-profile__wrapper">
            <div class="grad-profile__avatar">
                <img :src="user.avatar" />
            </div>
            <div>
                <group-tag v-for="g in user.groups" :key="g.tag" :group="g" />
            </div>
            <div>
                <input type="text" :value="user.username" :disabled="!canEdit" />
            </div>
            <!-- <div>
                <input type="text" :value="user.steamId" />
            </div> -->
            <div>
                <md-switch v-model="user.admin" class="md-secondary">Adminrechte</md-switch>
            </div>
        </div>
        <span>{{$root.$data.user}}</span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { User } from '@/models';
import GroupTag from '@/components/GroupTag.vue';
import { authenticate, fetchUser } from '../services';
@Component({
    components: { GroupTag }
})
export default class ProfileVue extends Vue {
    @Prop() private uid?: number;

    private error: any = null;
    private user?: User|null = null;
    private canEdit: boolean = true;


    private created() {
        this.fetchUser();
    }

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
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    &__wrapper {
        display: flex;
        background-color: white;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 10px;
        flex-direction: column;
        align-items: center;
        max-width: 100vw;
        overflow: hidden;


        > * {
            margin: 10px 20px;
        }
    }

    input {
        background: #F0F0F0;
        border: 1px solid #999999;
        box-sizing: border-box;
        border-radius: 4px;
        text-align: center;
        font-size: 18px;
        padding: 15px;
        width: 300px;
    }

    &__avatar {
        position: relative;
        display: inline-flex;
        user-select: none;
        border-radius: 50%;
        overflow: hidden;
    }
}

.grad-profile.grad-profile--editable {
    .grad-profile__avatar {
        cursor: pointer;

        &:hover {
            &::before,
            &::after {
                display: block;
                position: absolute;
                background-color: rgba(0,0,0,0.4);
                content: '';
            }
            &::before {
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
            }
        
            &::after {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                padding: 0.2em;
                border-radius: 2px;
                content: 'ÄNDERN';
            }
        }
    }
}

</style>