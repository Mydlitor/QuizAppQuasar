<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow" no-backdrop-dismiss
        no-shake ref="qDialogRef" class="q-dialog">
        <div class="team-settings-main">
            <div class="team-data-table">
                <q-table :columns="columns" :rows="teamsData" row-key="name" hide-pagination flat bordered
                    separator="cell" :rows-per-page-options="[0]">
                    <template v-slot:body="props">
                        <q-tr :props="props" @contextmenu.prevent="onRowContextMenu($event, props.row)">
                            <q-td key="index" :props="props" style="width: 20%;">
                                {{ props.rowIndex + 1 }}
                            </q-td>
                            <q-td key="teamName" :props="props" @dblclick="teamNamePopupRefs[props.rowIndex]?.show()">
                                {{ props.row.name }}
                                <q-popup-edit v-model="props.row.name" auto-save v-slot="scope" no-parent-event
                                    :validate="validateNewTeam" :ref="el => { teamNamePopupRefs[props.rowIndex] = el }">
                                    <q-input v-model="scope.value" dense autofocus borderless :error="teamsError"
                                        :error-message="teamsErrorMessage" @keyup.enter="scope.set" />
                                </q-popup-edit>
                            </q-td>
                            <q-td key="color" :props="props" style="width: 20%;" :style="{ 'color': props.row.color }"
                                @dblclick="teamColorPopupRefs[props.rowIndex]?.show()">
                                {{ props.row.color }}
                                <q-popup-edit v-model="props.row.color" buttons v-slot="scope" no-parent-event
                                    :ref="el => { teamColorPopupRefs[props.rowIndex] = el }">
                                    <q-color v-model="scope.value" no-header no-footer default-view="palette"
                                        class="my-picker" format-model="hex" />

                                </q-popup-edit>
                            </q-td>
                        </q-tr>
                    </template>
                    <template v-slot:bottom-row>
                        <q-tr>
                            <q-td colspan="100%" style="text-align: center; cursor: pointer;" @click="onAddTeam">
                                <q-icon :name="matAddCircle" style="margin-right: 0.5rem;" />
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
                    <q-item-section>Remove team</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-dialog>
</template>

<script setup>
//show all teams
//option to add and remove team
//option to rename team
//option to change color

import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { matAddCircle } from '@quasar/extras/material-icons'

const $q = useQuasar();

const teamsData = ref([])
const selectedContextTeam = ref(null)
const teamContextMenuRef = ref(null)
const teamNamePopupRefs = ref([])
const teamColorPopupRefs = ref([])
const columns = [
    {
        name: 'index',
        align: 'center',
        label: 'No.',
        field: 'index'
    },
    {
        name: 'teamName',
        align: 'center',
        label: 'Team name',
        field: 'name'
    },
    {
        name: 'color',
        align: 'center',
        label: 'Color',
        field: 'color'
    }
]
const qDialogRef = ref(null)

const teamsError = ref(false)
const teamsErrorMessage = ref('')

const validateNewTeam = (val) => {
    if (teamsData.value.some(t => t.name === val)) {
        teamsError.value = true;
        teamsErrorMessage.value = "EACH TEAM MUST HAVE UNIQUE NAME"
        return false;
    }
    return true;
}

const validateAllTeams = () => {
    let nameSet = new Set(teamsData.value.map(t => t.name))
    let colorSet = new Set(teamsData.value.map(t => t.color))
    if (nameSet.size != teamsData.value.length || colorSet.size != teamsData.value.length) {
        console.log(nameSet.size, colorSet.size, teamsData.value.length)
        return false;
    }
    return true;
}

const onRowContextMenu = (event, team) => {
    console.log("team: ", team)
    // store a shallow copy to avoid proxy/reference issues
    selectedContextTeam.value = team;
    teamContextMenuRef.value?.show(event)
}

// const onColorConextMenu = (event, team) => {
//     selectedContextTeam.value = team
//     teamContextMenuRef.value?.show(event)
// }

const onRemoveTeam = () => {
    console.log("delete: ", selectedContextTeam.value)
    teamsData.value = teamsData.value.filter((t) => { return t != selectedContextTeam.value })
}

const onAddTeam = () => {
    teamsData.value.push({ name: "NEW TEAM", color: "white" })
}

const onSave = () => {
    if (validateAllTeams() === false) {
        $q.notify({
            message: "EACH TEAM MUST HAVE UNIQUE NAME AND COLOR"
        })
        return;
    }
    emit('save-changes', teamsData.value)
    qDialogRef.value.hide()
}

const onCancel = () => {
    qDialogRef.value.hide()
}

const onDialogBeforeShow = () => {
    console.log("before show")
    if (!props.teams) {
        teamsData.value = []
        return
    }
    teamsData.value = props.teams.map(t => ({ name: t.name, color: t.color }))
}

const onDialogBeforeHide = () => {

}

const props = defineProps({
    teams: Array
})

const emit = defineEmits(['save-changes'])

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

.buttons {
    display: flex;
    flex-direction: row;
    gap: 2rem;
}
</style>
