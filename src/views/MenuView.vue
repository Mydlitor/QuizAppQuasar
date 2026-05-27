<template>
    <q-page class="menu-view-main">
        <h2 class="game-name">{{ gameName }}</h2>
        <router-link to='/game'>
            <q-btn class="start-button" label="START GAME" size="xl" />
        </router-link>
        <div class="settings-buttons">
            <q-btn label="TEAM SETTINGS" @click="onOpenTeamSettings" />
            <q-btn label="QUESTION SETTINGS" @click="onOpenQuestionSettings" />
        </div>
    </q-page>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useGameStore } from 'src/stores/gameStore';

const gameStore = useGameStore();

const gameName = ref(null)

const onOpenTeamSettings = () => {
    console.log("teamsettings opened")
}

const onOpenQuestionSettings = () => {
    console.log("questionsettings opened")
}

//>edit questions
//>edit teams
//start game
// import { useGameStore } from 'src/stores/gameStore';

// const gameStore = useGameStore()
onBeforeMount(() => {
    gameStore.setupData()
    gameName.value = gameStore.getGameName()
})
</script>

<style lang="scss" scoped>
.menu-view-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5rem;
}

.game-name {
    font-weight: 600;
}

.settings-buttons {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.start-button {
    color: white;
}
</style>
