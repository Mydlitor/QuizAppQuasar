<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow" no-backdrop-dismiss
        no-shake ref="qDialogRef">

    </q-dialog>
</template>

<script setup>
//show all teams
//option to add and remove team
//option to rename team
//option to change color

import { useGameStore } from 'src/stores/gameStore';
import { ref } from 'vue';

const gameStore = useGameStore()

const teams = ref(null)

const onDialogBeforeShow = () => {
    teams.value = gameStore.getTeams()
}

const onDialogBeforeHide = () => {

}

</script>
