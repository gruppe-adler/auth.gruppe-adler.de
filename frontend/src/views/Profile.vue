<template>
    <div class="grad-profile" v-if="user">
        <img class="grad-profile__avatar" :src="user.avatar" />
        <span>{{user.username}}</span>
        <group-tag :group="user.group" />
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
            avatar: '',
            group: {
                tag: 'Adler',
                color: '#333',
                users: []
            }
        };
    }
}
</script>
