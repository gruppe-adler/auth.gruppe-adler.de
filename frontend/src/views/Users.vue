<template>
    <div class="grad-users">
        <div class="grad-users__filter">
            <input type="text" placeholder="Suchen nach ..." v-model="filter" />
            <div @click="showFlyOut">
                <span v-if="filterGroup">{{filterGroup.label}}</span>
                <span v-else>Alle Gruppen</span>
                <i class="material-icons">arrow_drop_down</i>
                <div v-if="flyOutShown" class="grad-users__filter-flyout grad-menu">
                    <span @click="selectFilterGroup(null)" class="grad-users__filter-flyout--all">Alle Gruppen</span>
                    <span v-for="g in groups" :key="g.tag" @click="selectFilterGroup(g)">
                        <GroupTag :group="g" :disabled="true" />
                    </span>
                </div>
            </div>
        </div>
        <div class="grad-users__list grad-list">
            <div v-for="u in filteredUsers" :key="u.id" @click="$router.push(`/user/${u.id}`)">
                <img :src="u.avatar" />
                <span>{{u.username}}</span>
                <div style="display: flex; overflow-x: hidden;" >
                    <GroupTag 
                        v-for="g in sortUserGroups(u)"
                        :star="u.primaryGroup && g.tag === u.primaryGroup.tag"
                        :key="g.tag"
                        :group="g"
                        :disabled="true"
                    />
                </div>
            </div>
        </div>
        <Loader v-if="loading" />
        <!-- TODO: Show Error -->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { User, Group } from '@/models';
import { fetchGroups, fetchUsers } from '@/services';

import GroupTagVue from '@/components/Group/Tag.vue';
import LoaderVue from '@/components/Loader.vue';

@Component({
    components: {
        GroupTag: GroupTagVue,
        Loader: LoaderVue
    }
})
export default class UsersVue extends Vue {
    private loading: boolean = false;
    private users: User[] = [];
    private groups: Group[] = [];
    private filterGroup: Group|null = null;
    private filter: string = '';
    private flyOutShown: boolean = false;

    private created() {
        this.fetchUsersAndGroups();
    }

    private get filteredUsers(): User[] {
        let filtered = this.users;

        if (this.filter.length > 0) {
            filtered = filtered.filter(u => u.username.toLowerCase().includes(this.filter.toLowerCase()));
        }

        if (this.filterGroup) {
            filtered = filtered.filter(u => u.groups.find(g => g.tag === this.filterGroup!.tag));
        }

        return filtered;
    }

    private async fetchUsersAndGroups() {
        this.loading = true;

        const p1 = fetchUsers();
        const p2 = fetchGroups();

        this.users = await p1;
        this.groups = await p2;
        // TODO: Catch errors
        this.loading = false;
    }

    private selectFilterGroup(group: Group) {
        this.filterGroup = group;
    }

    private sortUserGroups(user: User) {
        return [ ...user.groups ].sort((a, b) => {

            // make sure filtedGroup always comes first
            if (this.filterGroup && a.tag === this.filterGroup.tag) return -1;
            if (this.filterGroup && b.tag === this.filterGroup.tag) return 1;

            // after that comes the primary group
            if (user.primaryGroup && a.tag === user.primaryGroup.tag) return -1;
            if (user.primaryGroup && b.tag === user.primaryGroup.tag) return 1;

            return 0;
        });
    }

    private showFlyOut() {
        if (this.flyOutShown) {
            this.flyOutShown = false;
            return;
        }

        this.flyOutShown = true;
        window.setTimeout(() => window.addEventListener('click', this.onClick), 100);
    }

    private onClick(event: MouseEvent) {
        this.flyOutShown = false;
        window.removeEventListener('click', this.onClick);

        event.stopPropagation();
    }
}
</script>

<style lang="scss" scoped>
.grad-users {
    flex: 1;
    width: 500px;
    display: flex;
    flex-direction: column;

    &__filter {
        width: 100%;
        display: flex;
        
        > input {
            text-align: left;
            width: auto;
            flex: 1;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
        }

        > div {
            display: flex;
            cursor: pointer;
            background-color: #D6D4D3;
            transition: all .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            padding: 20px;
            text-align: right;
            font-weight: 600;
            letter-spacing: 0.01em;
            box-sizing: border-box;
            position: relative;
        }

        &:focus-within {
            > div {
                background-color: white;
            }
        }

        &-flyout {
            position: absolute;
            top: 0px;
            right: 0px;
            text-align: left;

            > *:not(.grad-users__filter-flyout--all) {
                padding-top: 12px;
                padding-bottom: 12px;
            }
        }
    }

    &__list > * {
        padding-top: 12px;
        padding-bottom: 12px;
        display: grid;
        grid-column-gap: 16px;
        grid-template-columns: 40px .4fr .6fr;

        img {
            height: 40px;
            width: 40px;
            border-radius: 20px;
        }
    }

}
</style>
