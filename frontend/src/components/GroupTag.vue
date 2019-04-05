<template>
    <div ref="tag" class="grad-group-tag">{{group.tag.toUpperCase()}}</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Group } from '@/models';

@Component
export default class GroupTag extends Vue {
    @Prop() public group?: Group;

    private mounted() {
        if (! this.group) return;

        (this.$refs.tag as HTMLElement).style.setProperty('--grad-tag-color', this.group.color);
    }
}
</script>

<style lang="scss" scoped>
.grad-group-tag {
    $bg-color: var(--grad-tag-color, red);

    height: 1.2em;
    padding: .1em .3em;
    border-radius: .2em;
    background-color: $bg-color;
    color: choose-contrast-color($bg-color);
    display: inline-block;
    margin: 0 .2em;
}
</style>
