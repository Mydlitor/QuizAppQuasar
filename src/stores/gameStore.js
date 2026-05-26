import { ref } from "vue";
import questionsJson from "assets/questions.json";
import teamsJson from "assets/teams.json";

const questions = ref([]);
const questionsMap = ref(new Map());
const teams = ref([]);
const currentTeam = ref(null);

const getQuestions = () => questions.value;
const getTeams = () => teams.value;
const getCurrentTeam = () => currentTeam.value;

const getNextTeam = (team) => {
    const teamIndex = teams.value.indexOf(team);
    if (teamIndex >= teams.value.length - 1) return teams.value[0];
    return teams.value[teamIndex + 1];
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

const setupData = () => {
    questions.value = questionsJson;
    teams.value = teamsJson.teams;
    setQuestionValues();
    currentTeam.value = teams.value[0];
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
        getNextTeam,
        setQuestionCorrect,
        setQuestionIncorrect,
        setupData,
    };
}
