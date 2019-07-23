<template>
    <div class="grad-groups">
        <div class="grad-groups__add">
            <input type="text" placeholder="Name" />
            <button>Hinzufügen</button>
        </div>
        <div class="grad-groups__list grad-list">
            <div v-for="g in groups" :key="g.tag" :style="`color: ${g.color}`">
                <GroupBlob />
                <span>{{g.label}}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Group } from '@/models';
import { fetchGroups } from '@/services';

import GroupBlobVue from '@/components/Group/Blob.vue';

@Component({
    components: {
        GroupBlob: GroupBlobVue
    }
})
export default class GroupsVue extends Vue {
    private groups: Group[] = [];

    private created() {
        if (!this.$root.$data.user.admin) {
            this.$router.push('/unauthorized');
            return;
        }

        this.fetchGroups();
    }

    private async fetchGroups() {
        this.groups = await fetchGroups();
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
            background-color: white;
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
