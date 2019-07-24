<template>
    <div class="grad-groups">
        <div class="grad-groups__add">
            <input type="text" placeholder="Name eingeben..." v-model="addName" />
            <button @click="add" :disabled="addName.length === 0">Hinzufügen</button>
        </div>
        <span  v-if="!loading && groups.length === 0" style="margin-top: 24px; text-align: center;">
            Sieht so aus als ob es noch keine Gruppen gibt.
        </span>
        <div class="grad-groups__list grad-list">
            <div v-for="g in groups" :key="g.tag" :style="`color: ${g.color}`" @click="$router.push(`/group/${g.id}`)">
                <GroupBlob />
                <span>{{g.label}}</span>
            </div>
        </div>
        <Loader v-if="loading" />
        <!-- TODO: Show Error -->
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Group } from '@/models';
import { fetchGroups } from '@/services';

import GroupBlobVue from '@/components/Group/Blob.vue';
import LoaderVue from '@/components/Loader.vue';

@Component({
    components: {
        GroupBlob: GroupBlobVue,
        Loader: LoaderVue
    }
})
export default class GroupsVue extends Vue {
    private groups: Group[] = [];
    private addName: string = '';
    private loading: boolean = false;

    private created() {
        this.fetchGroups();
    }

    private async fetchGroups() {
        this.loading = true;
        this.groups = await fetchGroups();
        // TODO: fetch errors
        this.loading = false;
    }

    private add() {
        this.$router.push(`/group/create?label=${this.addName}`);
    }
}
</script>

<style lang="scss" scoped>
.grad-groups {
    flex: 1;
    width: 500px;
    display: flex;
    flex-direction: column;

    &__add {
        width: 100%;
        position: relative;

        input {
            text-align: left;
        }

        button {
            position: absolute;
            top: 10px;
            right: 10px;
        }
    }

    &__list > * > span:last-child {
        margin-left: 12px;
        color: #333333;
    }
}
</style>
