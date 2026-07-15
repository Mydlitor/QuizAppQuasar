<template>
    <div class="teams-display-main">
        <q-avatar class="team-card" rounded v-for="team in props.teams" :key="team.name"
            :style="{ outline: team.name === currentTeam?.name ? '3px solid white' : 'none' }">
            <q-img :src="'/avatars/' + team.avatar" style="height: 100%" />
        </q-avatar>
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
    outline-offset: 3px;
}
</style>
