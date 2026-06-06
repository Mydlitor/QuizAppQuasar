<template>
    <q-dialog full-width @before-show="onDialogBeforeShow" no-backdrop-dismiss no-shake ref="qDialogRef">
        <div class="dialog-main" ref="dialogDivRef">
            <h2 style="font-weight: 700;">RESULTS</h2>
            <div v-for="(team, index) in sortedTeams" v-bind:key="team.name">
                <h3>{{ index + 1 }}. {{ team.name }} &emsp; {{ team.points }} points</h3>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
const sortedTeams = ref([]);

const props = defineProps({
    teams: Array,
})

const onDialogBeforeShow = () => {
    sortedTeams.value = props.teams;
    sortedTeams.value.sort((a, b) => a.points - b.points);
    sortedTeams.value.reverse();
    console.log(props.teams)
}
</script>

<style lang="scss">
.dialog-main {
    height: 80%;
    width: 80% !important;
    background-color: $dark;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: solid 3px transparent;
    transition: border-color 200ms ease;
}
</style>
