<template>
    <div class="grad-user-groups">
        <GroupTag 
            v-for="g in sortedGroups"
            :key="g.tag"
            :group="g"
            :star="primaryGroup && primaryGroup.tag == g.tag"
            @delete="removeGroup"
            @select="$emit('select', $event)" />
        <div class="grad-user-groups__add" @click="showFlyOut" v-if="availableGroups.length > 0">
            <i class="material-icons">add_circle_outline</i>
            <div v-if="flyOut" class="grad-user-groups__add-flyout grad-menu">
                <span v-for="g in availableGroups" :key="g.tag" @click="addGroup(g)">
                    <GroupTag :group="g" :disabled="true" />
                </span>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import GroupTagVue from '@/components/Group/Tag.vue';
import { Group } from '@/models';
import { fetchGroups } from '@/services';

@Component({
    components: {
        GroupTag: GroupTagVue
    }
})
export default class UserGroupsVue extends Vue {
    public allGroups: Group[] = [];
    @Prop({ default: null }) public primaryGroup!: Group|null;

    @Prop({ default: [] }) public value!: Group[];
    get groups(): Group[] { return this.value; }
    set groups(val: Group[]) { this.$emit('input', val); }

    private flyOut: boolean = false;

    private created() {
        this.fetchGroups();
    }

    private get sortedGroups() {
        return this.groups.sort((a, b) => {
            if (!this.primaryGroup) return 0;

            if (a.tag === this.primaryGroup.tag) return -1;
            if (b.tag === this.primaryGroup.tag) return 1;

            return 0;
        });
    }

    get availableGroups() {
        return this.allGroups.filter(g => !this.groups.find(g2 => g2.tag === g.tag));
    }

    private async fetchGroups() {
        // TODO: Handle loading
        // TODO: Handle errors
        this.allGroups = await fetchGroups();
    }

    private addGroup(group: Group) {
        this.groups.push(group);
        window.setTimeout(() => this.onClick(null), 100);
    }

    private removeGroup(group: Group) {
        const index = this.groups.findIndex(x => x.tag === group.tag);

        this.groups.splice(index, 1);
    }

    private showFlyOut() {
        if (this.flyOut) {
            this.flyOut = false;
            return;
        }

        this.flyOut = true;
        window.setTimeout(() => window.addEventListener('click', this.onClick), 100);
    }

    private onClick(event: MouseEvent|null) {
        this.flyOut = false;
        window.removeEventListener('click', this.onClick);

        if (event) event.stopPropagation();
    }
}

</script>

<style lang="scss" scoped>
.grad-user-groups {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    
    &__add {
        cursor: pointer;
        position: relative;
        display: flex;

        > i {
            padding: 10px;
            opacity: .5;
            transition: all .1s linear;

            &:hover {
                color: #2F80ED;
                opacity: 1;
            }
        }

        &-flyout {
            position: absolute;
            right: 0px;
            top: 0px;

            > * {
                padding-top: 12px;
                padding-bottom: 12px;
            }
        }
    }
}
</style>
