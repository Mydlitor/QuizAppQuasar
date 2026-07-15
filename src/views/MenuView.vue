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
        <q-btn label="EXIT" @click="onExit" />
        <team-settings-dialog v-model="isTeamSettingsDialogShown" :teams="teams" @save-changes="onTeamSettingsSave" />
        <question-settings-dialog v-model="isQuestionSettingsDialogShown" :questions="questions"
            @save-changes="onQuestionSettingsSave" @reset-progress="onResetProgress" @upload-media="onMediaUpload" />
    </q-page>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useGameStore } from 'src/stores/gameStore';
import TeamSettingsDialog from 'src/components/TeamSettingsDialog.vue';
import QuestionSettingsDialog from 'src/components/QuestionSettingsDialog.vue';

const gameStore = useGameStore();
const $q = useQuasar();

const gameName = computed(() => gameStore.getGameName())
const teams = computed(() => gameStore.getTeams())
const questions = computed(() => gameStore.getQuestions())
const isTeamSettingsDialogShown = ref(false)
const isQuestionSettingsDialogShown = ref(false)

const onOpenTeamSettings = () => {
    isTeamSettingsDialogShown.value = true;
}

const onOpenQuestionSettings = () => {
    isQuestionSettingsDialogShown.value = true;
    console.log(questions.value)
}

const onTeamSettingsSave = async (newTeamsData) => {
    await gameStore.updateTeamsData(newTeamsData);
}

const onQuestionSettingsSave = async (newQuestionsData) => {
    await gameStore.updateQuestionsData(newQuestionsData);
}

const onResetProgress = () => {
    gameStore.resetGameProgress();
}

const onMediaUpload = async ({ file, row }) => {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const uniqueFileName = `${Date.now()}_${file.name}`;

        const response = await gameStore.saveMedia(uniqueFileName, data);
        if (response && response.ok) {
            row.media = uniqueFileName;
            $q.notify({ type: "positive", message: "Media uploaded successfully" });
        } else {
            $q.notify({ type: "negative", message: "Failed to upload media" });
        }
    } catch (err) {
        console.error("Failed to upload media:", err);
        $q.notify({ type: "negative", message: "Error uploading media" });
    }
}

const onExit = () => {
    gameStore.quitApp();
}

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
