<template>
<div class="grad-return">
    <Loader />
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import LoaderVue from '@/components/Loader.vue';

import { logIn } from '@/services';

@Component({
    components: {
        Loader: LoaderVue
    }
})
export default class ReturnVue extends Vue {
    private mounted() {
        this.logIn();
    }

    private async logIn() {
        try {
            await logIn(process.env.BASE_URL + this.$route.fullPath);
        } catch (err) {
            // TODO: Catch errors
            return;
        }

        this.$router.push('/redirect');
    }
}
</script>