<template>
    <div 
        v-if="group" 
        :class="[ 
            'grad-group-tag',
            disabled ? 'grad-group-tag--disabled' : '',
        ]"
        :style="`color: ${group.color};`"
    >
        <GroupBlob />
        <span>{{group.label}}</span>
        <i v-if="star" class="material-icons" style="color: #2F80ED;">star</i>
        <template v-if="!disabled">
            <i v-if="!star" class="material-icons grad-group-tag__star" @click="$emit('select', group)">star_border'</i>
            <i class="material-icons grad-group-tag__delete" @click="$emit('delete', group)">delete</i>
        </template>
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
    @Prop({ default: false }) public star!: boolean;
    @Prop({ default: false }) public disabled!: boolean;

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
        color: #999999;
        margin: 0px 5px;
        cursor: pointer;
        height: 24px;
        width: 24px;
        overflow: hidden;

        &:last-child {
            margin-right: 0px;
        }
    }

    &__delete {
        &:hover {
            color: #8F1167;
        }
    }

    &__star {
        &:hover {
            color: #2F80ED;
        }
    }

    &__star,
    &__delete {
        display: none;
    }

    &:hover &__star,
    &:hover &__delete {
        display: initial;
    }

    > span {
        margin-left: 8px;
        color: #333;
    }

    &:hover {
        background-color: white;
    }

    &#{&}--disabled:hover {
        background-color: transparent;
    }
}
</style>