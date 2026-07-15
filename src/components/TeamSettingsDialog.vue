<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow" no-backdrop-dismiss
        no-shake ref="qDialogRef" class="q-dialog">
        <div class="team-settings-main">
            <div class="team-data-table">
                <q-table :columns="columns" :rows="teamsData" row-key="name" hide-pagination flat bordered
                    separator="cell" :rows-per-page-options="[0]">
                    <template v-slot:body="props">
                        <q-tr :props="props" @contextmenu.prevent="onRowContextMenu($event, props.rowIndex)">
                            <q-td key="index" :props="props" style="width: 20%">
                                <div class="index-container">
                                    {{ props.rowIndex + 1 }}
                                    <div class="move-buttons-container">
                                        <q-btn :disable="props.rowIndex <= 0" size="xs"
                                            @click="onMoveUp(props.rowIndex)">
                                            <q-icon :name="matKeyboardArrowUp" size="xs" />
                                        </q-btn>
                                        <q-btn :disable="props.rowIndex >= teamsData.length - 1" size="xs"
                                            @click="onMoveDown(props.rowIndex)">
                                            <q-icon :name="matKeyboardArrowDown" size="xs" />
                                        </q-btn>
                                    </div>
                                </div>
                            </q-td>
                            <q-td key="teamName" :props="props" @dblclick="teamNamePopupRefs[props.rowIndex]?.show()">
                                {{ props.row.name }}
                                <q-popup-edit v-model="props.row.name" auto-save v-slot="scope" no-parent-event
                                    :validate="validateNewTeam" :ref="(el) => {
                                        teamNamePopupRefs[props.rowIndex] = el;
                                    }
                                        ">
                                    <q-input v-model="scope.value" dense autofocus borderless :error="teamsError"
                                        :error-message="teamsErrorMessage" @keyup.enter="scope.set" />
                                </q-popup-edit>
                            </q-td>
                            <q-td key="color" :props="props" style="width: 20%" :style="{ color: props.row.color }"
                                @dblclick="teamColorPopupRefs[props.rowIndex]?.show()">
                                {{ props.row.color }}
                                <q-popup-edit v-model="props.row.color" buttons v-slot="scope" no-parent-event :ref="(el) => {
                                    teamColorPopupRefs[props.rowIndex] = el;
                                }
                                    ">
                                    <q-color v-model="scope.value" no-header no-footer default-view="palette"
                                        class="my-picker" format-model="hex" />
                                </q-popup-edit>
                            </q-td>
                            <q-td key="avatar" :props="props" style="width: 20%"
                                @dblclick="teamAvatarPopupRefs[props.rowIndex]?.show()">
                                <q-img :src="'/avatars/' + props.row.avatar" style="height: 3rem; width: 3rem" />
                                <q-menu no-parent-event anchor="bottom middle" self="top middle" :ref="(el) => {
                                    teamAvatarPopupRefs[props.rowIndex] = el;
                                }
                                    ">
                                    <q-card>
                                        <div class="avatar-selector">
                                            <q-avatar v-for="i in avatarsNo" :key="i" square size="5rem" @click="
                                                onAvatarSelect(props.row, i - 1, props.rowIndex)
                                                ">
                                                <q-img class="avatar-selector-item"
                                                    :src="'/avatars/avatar' + (i - 1) + '.png'" fit="fill" />
                                            </q-avatar>
                                        </div>
                                    </q-card>
                                </q-menu>
                            </q-td>
                        </q-tr>
                    </template>
                    <template v-slot:bottom-row>
                        <q-tr>
                            <q-td colspan="100%" style="text-align: center; cursor: pointer" @click="onAddTeam">
                                <q-icon :name="matAddCircle" style="margin-right: 0.5rem" />
                                <span>ADD TEAM</span>
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </div>
            <div class="buttons">
                <q-btn label="SAVE" @click="onSave" />
                <q-btn label="CANCEL" @click="onCancel" />
            </div>
        </div>
        <q-menu ref="teamContextMenuRef" anchor="top left" self="top left" context-menu auto-close>
            <q-list>
                <q-item clickable v-close-popup @click="onRemoveTeam">
                    <q-item-section>REMOVE TEAM</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import {
    matAddCircle,
    matKeyboardArrowDown,
    matKeyboardArrowUp,
} from "@quasar/extras/material-icons";

const $q = useQuasar();

const avatarsNo = 10;
const teamsData = ref([]);
const selectedContextTeamIndex = ref(-1);
const teamContextMenuRef = ref(null);
const teamNamePopupRefs = ref([]);
const teamColorPopupRefs = ref([]);
const teamAvatarPopupRefs = ref([]);
const columns = [
    {
        name: "index",
        align: "center",
        label: "No.",
        field: "index",
    },
    {
        name: "teamName",
        align: "center",
        label: "Team name",
        field: "name",
    },
    {
        name: "color",
        align: "center",
        label: "Color",
        field: "color",
    },
    {
        name: "avatar",
        align: "center",
        label: "Avatar",
        field: "avatar",
    },
];
const qDialogRef = ref(null);

const teamsError = ref(false);
const teamsErrorMessage = ref("");

const onMoveUp = (index) => {
    if (index <= 0) return;
    [teamsData.value[index - 1], teamsData.value[index]] = [
        teamsData.value[index],
        teamsData.value[index - 1],
    ];
};

const onMoveDown = (index) => {
    if (index >= teamsData.value.length - 1) return;
    [teamsData.value[index + 1], teamsData.value[index]] = [
        teamsData.value[index],
        teamsData.value[index + 1],
    ];
};

const validateNewTeam = (val) => {
    if (teamsData.value.some((t) => t.name === val)) {
        teamsError.value = true;
        teamsErrorMessage.value = "EACH TEAM MUST HAVE UNIQUE NAME";
        return false;
    }
    return true;
};

const validateAllTeams = () => {
    let nameSet = new Set(teamsData.value.map((t) => t.name));
    let colorSet = new Set(teamsData.value.map((t) => t.color));
    let avatarSet = new Set(teamsData.value.map((t) => t.avatar));
    if (
        nameSet.size != teamsData.value.length ||
        colorSet.size != teamsData.value.length ||
        avatarSet.size != teamsData.value.length
    ) {
        return false;
    }
    return true;
};

const onRowContextMenu = (event, teamIndex) => {
    selectedContextTeamIndex.value = teamIndex;
    teamContextMenuRef.value?.show(event);
};

const onAvatarSelect = (row, avatarIndex, rowIndex) => {
    row.avatar = "avatar" + avatarIndex + ".png";
    teamAvatarPopupRefs.value[rowIndex]?.hide();
};

const onRemoveTeam = () => {
    teamsData.value.splice(selectedContextTeamIndex.value, 1);
};

const onAddTeam = () => {
    teamsData.value.push({ name: "NEW TEAM", color: "white" });
};

const onSave = () => {
    if (validateAllTeams() === false) {
        $q.notify({
            message: "EACH TEAM MUST HAVE UNIQUE NAME, COLOR AND AVATAR",
        });
        return;
    }
    emit("save-changes", teamsData.value);
    qDialogRef.value.hide();
};

const onCancel = () => {
    qDialogRef.value.hide();
};

const onDialogBeforeShow = () => {
    if (!props.teams) {
        teamsData.value = [];
        return;
    }
    teamsData.value = props.teams.map((t) => ({ name: t.name, color: t.color, avatar: t.avatar }));
};

const onDialogBeforeHide = () => { };

const props = defineProps({
    teams: Array,
});

const emit = defineEmits(["save-changes"]);

Array.prototype.swap = function (x, y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
};
</script>

<style scoped lang="scss">
.team-settings-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60% !important;
    padding: 2rem 3rem;
    background-color: $dark;
    gap: 2rem;
}

.team-data-table {
    width: 100%;
}

.index-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
}

.move-buttons-container {
    display: flex;
    flex-direction: column;
}

.buttons {
    display: flex;
    flex-direction: row;
    gap: 2rem;
}

.avatar-selector {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 0.5rem;
    gap: 0.5rem;
}

.avatar-selector-item {
    width: 100%;
    aspect-ratio: 1;
    cursor: pointer;
}
</style>
