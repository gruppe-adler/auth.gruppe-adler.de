<template>
    <div v-if="group" class="grad-group-tag" :style="`color: ${group.color};`">
        <GroupBlob />
        <i class="material-icons" @click="$emit('delete', group)">close</i>
        <span>{{group.label}}</span>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Group } from '@/models';

import GroupBlobVue from '@/components/Group/Blob.vue';

@Component({
    components: {
        GroupBlob: GroupBlobVue
    }
})
export default class GroupTag extends Vue {
    @Prop() public group!: Group;
}
</script>

<style lang="scss" scoped>
.grad-group-tag {
    display: inline-flex;
    align-items: center;
    border-radius: 100px;
    padding: 10px 14px;
    width: auto;
    position: relative;

    i {
        color: #2F80ED;
        font-size: 1.2em;
        display: none;
        position: absolute;
        left: 10px;
        background-color: inherit;
        border-radius: 50%;
    }

    > span:last-child {
        margin-left: 12px;
        color: #333;
    }

    &:hover {
        background-color: white;

        > i {
            display: inline;
        }
    }
}
</style>