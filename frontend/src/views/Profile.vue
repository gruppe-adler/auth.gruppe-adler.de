<template>
    <div class="grad-profile" v-if="user">
        <div>
            <span>{{user.username}}</span>
            <group-tag :group="user.group" />
        </div>
        <div class="grad-profile__avatar">
            <img :src="user.avatar" />
        </div>
        <div>
            <label>E-Mail</label>
            <span>{{user.email}}</span>
            <i v-if="user.verified" class="material-icons">check</i>
            <i v-else class="material-icons">mail_outline</i>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { User } from '@/models';
import GroupTag from '@/components/GroupTag.vue';

@Component({
    components: { GroupTag }
})
export default class Profile extends Vue {
    public user?: User|null = null;

    private mounted() {
        this.user = {
            username: 'DerZade',
            email: 'DerZade@gmail.com',
            admin: false,
            verified: true,
            avatar: 'https://i.imgur.com/WLmLm9C.png',
            group: {
                tag: 'Adler',
                color: '#D18D1F',
                users: []
            }
        };
    }
}
</script>

<style lang="scss" scoped>
.grad-profile {
    &__avatar {
        position: relative;
        display: inline-flex;
        cursor: pointer;
        user-select: none;

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
                content: 'EDIT';
            }
        }
    }
}
</style>
