import { ref, computed, watch } from "vue";
import questionsJson from "assets/questions.json";
import teamsJson from "assets/teams.json";

const pointsForThreeInARow = 20;
const questions = ref([]);
const questionsMap = ref(new Map());
const teamsMap = ref(new Map());
const teams = ref([]);
const currentTeam = ref(null);
const gameName = ref(null);
const answerTime = ref(0);
const isGameEnded = ref(false);
const remainingQuestions = computed(() => {
    return [...questionsMap.value.values()].filter((q) => q.isAnswered == null).length;
});

const getQuestions = () => questions.value;
const getTeams = () => teams.value;
const getCurrentTeam = () => currentTeam.value;
const getGameEndedStatus = () => isGameEnded.value;

const getGameName = () => gameName.value;
const getAnswerTime = () => answerTime.value;

watch(remainingQuestions, (newRemainingQuestions) => {
    if (newRemainingQuestions <= 10) {
        calculateTeamScores();
        isGameEnded.value = true;
    }
});

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

    console.log(remainingQuestions.value);
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
    validateTeamsValues();
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
    gameName.value = questions.value.settings.gameName
        ? questions.value.settings.gameName
        : gameName.value;
    answerTime.value = questions.value.settings.answerTime
        ? questions.value.settings.answerTime
        : answerTime.value;
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
    validateTeamsValues();
    currentTeam.value = teams.value[0];
    gameName.value = questions.value.settings.gameName
        ? questions.value.settings.gameName
        : "GAME NAME";
    answerTime.value = questions.value.settings.answerTime
        ? questions.value.settings.answerTime
        : 30;
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

const validateTeamsValues = () => {
    teams.value.forEach((team) => {
        teamsMap.value.set(team.name, team);
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

const calculateTeamScores = () => {
    teams.value.forEach((team) => {
        team.points = 0;
    });

    calculateDirectQuestionPoints();
    calculateConnectedQuestionPoints();
};

const calculateDirectQuestionPoints = () => {
    questionsMap.value.forEach((value) => {
        if (value.teamAnswered) {
            const t = teamsMap.value.get(value.teamAnswered.name);
            t.points += value.points;
        }
    });
};

const calculateConnectedQuestionPoints = () => {
    let questionsAnswersArray = [];
    for (let c = 0; c < questions.value.categories.length; c++) {
        questionsAnswersArray[c] = [];
        for (let r = 0; r < questions.value.categories[c].questions.length; r++) {
            questionsAnswersArray[c][r] =
                questions.value.categories[c].questions[r].teamAnswered?.name;
        }
    }
    calculateConnectedInColumns(questionsAnswersArray);
    calculateConnectedInRows(questionsAnswersArray);
    calculateConnectedInDiagonals(questionsAnswersArray);
};

const calculateConnectedInColumns = (arr) => {
    for (let c = 0; c < arr.length; c++) {
        for (let r = 0; r < arr[c].length - 2; r++) {
            if (
                arr[c][r] == arr[c][r + 1] &&
                arr[c][r + 1] == arr[c][r + 2] &&
                arr[c][r + 2] != null
            ) {
                const t = teamsMap.value.get(arr[c][r]);
                t.points += pointsForThreeInARow;
            }
        }
    }
};

const calculateConnectedInRows = (arr) => {
    const rowCount = arr.length > 0 ? arr[0].length : 0;

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < arr.length - 2; c++) {
            if (
                arr[c][r] == arr[c + 1][r] &&
                arr[c + 1][r] == arr[c + 2][r] &&
                arr[c + 2][r] != null
            ) {
                const t = teamsMap.value.get(arr[c][r]);
                t.points += pointsForThreeInARow;
            }
        }
    }
};

const calculateConnectedInDiagonals = (arr) => {
    const columnCount = arr.length;
    const rowCount = arr.reduce((max, col) => Math.max(max, col.length), 0);

    for (let c = 0; c < columnCount - 2; c++) {
        for (let r = 0; r < rowCount - 2; r++) {
            if (
                arr[c]?.[r] == arr[c + 1]?.[r + 1] &&
                arr[c + 1]?.[r + 1] == arr[c + 2]?.[r + 2] &&
                arr[c + 2]?.[r + 2] != null
            ) {
                const t = teamsMap.value.get(arr[c][r]);
                t.points += pointsForThreeInARow;
            }
        }
    }

    for (let c = 0; c < columnCount - 2; c++) {
        for (let r = 2; r < rowCount; r++) {
            if (
                arr[c]?.[r] == arr[c + 1]?.[r - 1] &&
                arr[c + 1]?.[r - 1] == arr[c + 2]?.[r - 2] &&
                arr[c + 2]?.[r - 2] != null
            ) {
                const t = teamsMap.value.get(arr[c][r]);
                t.points += pointsForThreeInARow;
            }
        }
    }
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
        getAnswerTime,
        selectNextTeam,
        setQuestionCorrect,
        setQuestionIncorrect,
        updateTeamsData,
        updateQuestionsData,
        saveGameStatus,
        setupData,
        resetGameProgress,
        getGameEndedStatus,
        quitApp,
    };
}
