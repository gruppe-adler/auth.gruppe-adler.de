<template>
    <div ref="tag" class="grad-group-tag">{{group.label.toUpperCase()}}</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Group } from '@/models';
@Component
export default class GroupTag extends Vue {
    @Prop() public group?: Group;
    private mounted() {
        if (! this.group) return;
        (this.$refs.tag as HTMLElement).style.backgroundColor = this.group.color;
        (this.$refs.tag as HTMLElement).style.color = this.getCorrectTextColor(this.group.color);
    }
    private getCorrectTextColor(hex: string): string {
        /*
            From this W3C document:
            http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
            Color brightness is determined by the following formula:
            ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
        */
        hex = (hex.charAt(0) === '#') ? hex.substring(1, 7) : hex;
        const hRed = parseInt((hex).substring(0, 2), 16);
        const hGreen = parseInt((hex).substring(2, 4), 16);
        const hBlue = parseInt((hex).substring(4, 6), 16);
        const threshold = 149; /* about half of 256. Lower threshold equals more dark text on dark background  */
        const cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
        if (cBrightness > threshold) {
            return '#000000';
        } else {
            return '#FFFFFF';
        }
    }
}
</script>

<style lang="scss" scoped>
.grad-group-tag {
    height: 1.7em;
    line-height: 1.2em;
    padding: 0 .5em;
    border-radius: .2em;
    display: inline-block;
    margin: 0 .2em;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
}
</style>