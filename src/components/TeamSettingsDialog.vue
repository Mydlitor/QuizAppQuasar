<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow" no-backdrop-dismiss
        no-shake ref="qDialogRef" class="q-dialog">
        <div class="team-settings-main">
            <div class="team-data-table">
                <q-table :columns="columns" :rows="teamsData" row-key="name" hide-pagination flat bordered
                    separator="cell">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td key="index" :props="props" style="width: 20%;"
                                @contextmenu.prevent="onRowContextMenu($event, props.row)">
                                {{ props.rowIndex + 1 }}
                            </q-td>
                            <q-td key="teamName" :props="props">
                                {{ props.row.name }}
                                <q-popup-edit v-model="props.row.name" auto-save v-slot="scope">
                                    <q-input v-model="scope.value" dense autofocus borderless />
                                </q-popup-edit>
                            </q-td>
                            <q-td key="color" :props="props" style="width: 20%;" :style="{ 'color': props.row.color }">
                                {{ props.row.color }}
                                <q-popup-edit v-model="props.row.color" buttons v-slot="scope">
                                    <q-color v-model="scope.value" no-header no-footer default-view="palette"
                                        class="my-picker" format-model="hex" />

                                </q-popup-edit>
                            </q-td>
                        </q-tr>
                    </template>
                </q-table>
            </div>
            <div class="buttons">
                <q-btn label="SAVE" @click="onSaveButtonClicked" />
                <q-btn label="CANCEL" @click="onCancelButtonClicked" />
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

import { ref, defineEmits } from 'vue';

const teamsData = ref([])
const selectedContextTeam = ref(null)
const teamContextMenuRef = ref(null)
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

const onRowContextMenu = (event, team) => {
    selectedContextTeam.value = team
    teamContextMenuRef.value?.show(event)
}

// const onColorConextMenu = (event, team) => {
//     selectedContextTeam.value = team
//     teamContextMenuRef.value?.show(event)
// }

const onRemoveTeam = () => {
    teamsData.value = teamsData.value.filter((t) => { return t != selectedContextTeam.value })
}

const onCancelButtonClicked = () => {
    qDialogRef.value.hide()
}

const onSaveButtonClicked = () => {
    emit('save-changes', teamsData.value)
    qDialogRef.value.hide()
}

const onDialogBeforeShow = () => {
    if (!props.teams) {
        teamsData.value = []
        return
    }
    teamsData.value = props.teams;
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
