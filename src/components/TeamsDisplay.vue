<template>
    <div class="teams-display-main">
        <q-card
            class="team-card"
            v-for="team in props.teams"
            :key="team.name"
            :style="{ borderColor: team.name === currentTeam?.name ? 'white' : 'transparent' }"
        >
            <q-img :src="'/avatars/' + team.avatar" fit="cover" style="height: 100%" />
        </q-card>
    </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
    console.log(props.teams);
});

const props = defineProps({
    teams: Array,
    currentTeam: Object,
});
</script>

<style scoped lang="scss">
.teams-display-main {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    width: 100%;
}

.team-card {
    width: 5rem;
    height: 5rem;
    padding: 0 !important;
    margin: 0 !important;
    border: 3px solid transparent;
}
</style>
