<template>
    <div class="grad-users">
        <div class="grad-users__filter">
            <input type="text" placeholder="Suchen nach ..." />
            <div @click="showFlyOut">
                <span v-if="filterGroup">{{filterGroup.label}}</span>
                <span v-else>Alle Gruppen</span>
                <i class="material-icons">arrow_drop_down</i>
                <div v-if="flyOutShown" class="grad-users__filter-flyout grad-menu">
                    <span v-if="groups.length === 0">Keine Gruppen gefunden</span>
                    <span v-if="filterGroup" @click="selectGroup(null)">Alle Gruppen</span>
                    <span v-for="g in groups" :key="g.tag" @click="selectGroup(g)">{{g.label}}</span>
                </div>
            </div>
        </div>
        <div class="grad-users__list grad-list">
            <div v-for="u in users" :key="u.id">
                <img :src="u.avatar" />
                <span>{{u.username}}</span>
                <div>
                    <GroupTag :group="{ tag: 'adler', color: '#d18d1f', label: 'Adler' }" />
                    <GroupTag :group="{ tag: 'fuehrung', color: '#8F1167', label: 'Führung' }" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { User, Group } from '@/models';
import { fetchGroups, fetchUsers } from '@/services';

import GroupTagVue from '@/components/Group/Tag.vue';

@Component({
    components: {
        GroupTag: GroupTagVue
    }
})
export default class UsersVue extends Vue {
    private users: User[] = [];
    private groups: Group[] = [];
    private filterGroup: Group|null = null;
    private flyOutShown: boolean = false;

    private created() {
        if (!this.$root.$data.user.admin) {
            this.$router.push('/unauthorized');
            return;
        }

        this.fetchGroups();
        this.fetchUsers();
    }

    private async fetchGroups() {
        this.groups = await fetchGroups();
    }

    private async fetchUsers() {
        this.users = await fetchUsers();
    }

    private selectGroup(group: Group) {
        this.filterGroup = group;
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

        > div:nth-child(2) {
            display: flex;
            cursor: pointer;
            background: #D6D4D3;
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            padding: 20px;
            text-align: right;
            font-weight: 600;
            letter-spacing: 0.01em;
            box-sizing: border-box;
            position: relative;
        }

        &-flyout {
            position: absolute;
            top: 0px;
            right: 0px;
            text-align: left;
        }
    }

    &__list > * {
        padding-top: 12px;
        padding-bottom: 12px;
        display: grid;
        grid-template-columns: 40px .4fr .6fr;
    }

}
</style>
