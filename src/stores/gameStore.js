import { ref } from "vue";
import questionsJson from "assets/questions.json";
import teamsJson from "assets/teams.json";

const questions = ref([]);
const questionsMap = ref(new Map());
const teams = ref([]);
const currentTeam = ref(null);
const gameName = ref(null);

const getQuestions = () => questions.value;
const getTeams = () => teams.value;
const getCurrentTeam = () => currentTeam.value;

const getGameName = () => gameName.value;

const selectNextTeam = () => {
    const teamIndex = teams.value.indexOf(currentTeam.value);
    if (teamIndex === -1) return;
    const nextIndex = (teamIndex + 1) % teams.value.length;
    currentTeam.value = teams.value[nextIndex];
};

const setQuestionCorrect = (question, team) => {
    const q = questionsMap.value.get(question.id);
    if (!q) {
        console.error("Cant find question");
        return;
    }
    q.isAnswered = true;
    q.teamAnswered = team;
};

const setQuestionIncorrect = (question) => {
    const q = questionsMap.value.get(question.id);
    if (!q) {
        console.error("Cant find question");
        return;
    }
    q.isAnswered = false;
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const updateTeamsData = async (newTeamsData) => {
    const plainTeamsData = cloneData(newTeamsData);
    teams.value = plainTeamsData;
    try {
        if (typeof window !== "undefined" && window.api && window.api.saveTeams) {
            await window.api.saveTeams(plainTeamsData);
        }
    } catch (err) {
        console.error("Failed to save teams to file: ", err);
    }
};

const updateQuestionsData = async (newQuestionsData) => {
    const plainQuestionsData = cloneData(newQuestionsData);
    questions.value = plainQuestionsData;
    gameName.value = questions.value.gameName ? questions.value.gameName : gameName.value;
    validateQuestionValues();
    try {
        if (typeof window !== "undefined" && window.api && window.api.saveQuestions) {
            await window.api.saveQuestions(plainQuestionsData);
        }
    } catch (err) {
        console.error("Failed to save questions to file: ", err);
    }
};

const saveGameStatus = async () => {
    const plainQuestionsData = cloneData(questions.value);
    try {
        if (typeof window !== "undefined" && window.api && window.api.saveQuestions) {
            await window.api.saveQuestions(plainQuestionsData);
        }
    } catch (err) {
        console.error("Failed to save game progress to file: ", err);
    }
};

const setupData = async () => {
    let savedTeams = null;
    let savedQuestions = null;
    try {
        if (typeof window !== "undefined" && window.api && window.api.loadTeams) {
            savedTeams = await window.api.loadTeams();
            savedQuestions = await window.api.loadQuestions();
        }
    } catch (err) {
        console.warn("Failed to load saved teams/questions from file:", err);
        savedTeams = null;
        savedQuestions = null;
    }

    if (savedTeams && Array.isArray(savedTeams.teams)) {
        teams.value = cloneData(savedTeams.teams);
    } else {
        teams.value = teamsJson.teams;
        try {
            if (typeof window !== "undefined" && window.api && window.api.saveTeams) {
                await window.api.saveTeams(cloneData(teams.value));
            }
        } catch (err) {
            console.warn("Failed to save initial teams to file:", err);
        }
    }

    if (savedQuestions) {
        questions.value = cloneData(savedQuestions);
    } else {
        questions.value = questionsJson;
        try {
            if (typeof window !== "undefined" && window.api && window.api.saveQuestions) {
                await window.api.saveQuestions(cloneData(questions.value));
            }
        } catch (err) {
            console.warn("Failed to save initial questions to file:", err);
        }
    }

    validateQuestionValues();
    currentTeam.value = teams.value[0];
    gameName.value = questions.value.gameName ? questions.value.gameName : "GAME NAME";
};

const validateQuestionValues = () => {
    questions.value.categories.forEach((category) => {
        let number = 0;
        category.questions.forEach((question) => {
            question.number = number;
            if (!question.isAnswered) question.isAnswered = null;
            if (!question.teamAnswered) question.teamAnswered = null;
            question.points = (parseInt(question.number) + 1) * 10;
            question.id = category.name.substring(0, 16) + question.number;

            questionsMap.value.set(question.id, question);
            number++;
        });
    });
};

const resetGameProgress = () => {
    questions.value.categories.forEach((category) => {
        category.questions.forEach((question) => {
            question.isAnswered = null;
            question.teamAnswered = null;

            questionsMap.value.set(question.id, question);
        });
    });
    saveGameStatus();
};

const quitApp = () => {
    window.api.quitApp();
};

export function useGameStore() {
    return {
        getQuestions,
        getTeams,
        getCurrentTeam,
        getGameName,
        selectNextTeam,
        setQuestionCorrect,
        setQuestionIncorrect,
        updateTeamsData,
        updateQuestionsData,
        saveGameStatus,
        setupData,
        resetGameProgress,
        quitApp,
    };
}
