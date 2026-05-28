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

const updateTeamsData = (newTeamsData) => {
    teams.value = newTeamsData;
};

const setupData = () => {
    questions.value = questionsJson;
    teams.value = teamsJson.teams;
    setQuestionValues();
    currentTeam.value = teams.value[0];
    gameName.value = questions.value.gameName ? questions.value.gameName : "GAME NAME";
};

const setQuestionValues = () => {
    questions.value.categories.forEach((category) => {
        category.questions.forEach((question) => {
            question.isAnswered = null;
            question.points = (parseInt(question.number) + 1) * 10;
            question.teamAnswered = null;
            question.id = category.name.substring(0, 16) + question.number;

            questionsMap.value.set(question.id, question);
        });
    });
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
        setupData,
    };
}
