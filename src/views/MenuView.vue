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
        <team-settings-dialog v-model="isTeamSettingsDialogShown" :teams="teams" @save-changes="onTeamSettingsSave" />
        <question-settings-dialog v-model="isQuestionSettingsDialogShown" :questions="questions" />
    </q-page>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useGameStore } from 'src/stores/gameStore';
import TeamSettingsDialog from 'src/components/TeamSettingsDialog.vue';
import QuestionSettingsDialog from 'src/components/QuestionSettingsDialog.vue';

const gameStore = useGameStore();

const gameName = computed(() => gameStore.getGameName())
//const questions = computed(() => gameStore.getQuestions())
const teams = computed(() => gameStore.getTeams())
const questions = computed(() => gameStore.getQuestions())
const isTeamSettingsDialogShown = ref(false)
const isQuestionSettingsDialogShown = ref(false)

const onOpenTeamSettings = () => {
    isTeamSettingsDialogShown.value = true;
}

const onOpenQuestionSettings = () => {
    isQuestionSettingsDialogShown.value = true;
}

const onTeamSettingsSave = async (newTeamsData) => {
    await gameStore.updateTeamsData(newTeamsData);
}

//>edit questions
//>edit teams
//start game
// import { useGameStore } from 'src/stores/gameStore';

// const gameStore = useGameStore()
onBeforeMount(async () => {
    await gameStore.setupData()
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
