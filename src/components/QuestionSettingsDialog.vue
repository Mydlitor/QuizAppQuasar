<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow" no-backdrop-dismiss
        no-shake ref="qDialogRef" class="q-dialog">
        <div class="question-settings-main">
            <div class="question-data-table">
                <q-table class="categories-table" :columns="columns" :rows="questionData" row-key="name" hide-pagination
                    flat bordered separator="cell" :rows-per-page-options="[0]" virtual-scroll>
                    <template v-slot:body="props">
                        <q-tr :props="props" @click="props.expand = !props.expand">
                            <q-td key="index" :props="props" style="width: 20%;">
                                {{ props.rowIndex + 1 }}
                            </q-td>
                            <q-td key="name" :props="props">
                                {{ props.row.name }}
                            </q-td>
                            <q-td key="questionsCount" :props="props" style="width: 20%;">
                                {{ props.row.questions.length }}
                            </q-td>
                        </q-tr>
                        <q-tr v-show="props.expand" :props="props">
                            <q-td colspan="100%">
                                <q-table :columns="questionColumns" :rows="props.row.questions" row-key="id"
                                    hide-pagination flat bordered separator="cell" :rows-per-page-options="[0]">
                                    <template v-slot:body="props">
                                        <q-tr :props="props">
                                            <q-td key="index" :props="props" style="width: 20%;">
                                                {{ props.rowIndex + 1 }}
                                            </q-td>
                                            <q-td key="text" :props="props">
                                                {{ props.row.text }}
                                            </q-td>
                                        </q-tr>
                                    </template>
                                </q-table>
                            </q-td>
                        </q-tr>

                    </template>
                    <template v-slot:bottom-row>
                        <q-tr>
                            <q-td colspan="100%" style="text-align: center; cursor: pointer;" @click="onAddCategory">
                                <q-icon :name="matAddCircle" style="margin-right: 0.5rem;" />
                                <span>ADD CATEGORY</span>
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

    </q-dialog>
</template>

<script setup>
import { ref } from 'vue';

// import { useQuasar } from 'quasar';
import { matAddCircle } from '@quasar/extras/material-icons'

// const $q = useQuasar();


const questionData = ref([])
const columns = [
    {
        name: 'index',
        align: 'center',
        label: 'No.',
        field: 'index'
    },
    {
        name: 'name',
        align: 'center',
        label: 'Category name',
        field: 'name'
    },
    {
        name: 'questionsCount',
        align: 'center',
        label: 'Number of questions'
    }
]
const questionColumns = [
    {
        name: 'index',
        align: 'center',
        label: 'No.',
        field: 'index'
    },
    {
        name: 'text',
        align: 'left',
        label: 'Question',
        field: 'text'
    },

]
const qDialogRef = ref(null)

// const questionsError = ref(false)
// const questionsErrorMessage = ref('')


const onAddCategory = () => {
    questionData.value.push({ name: "NEW CATEGORY", questions: [] })
}

const onSave = () => {

}

const onCancel = () => {
    qDialogRef.value.hide()
}


const onDialogBeforeShow = () => {
    console.log("before show")
    if (!props.questions || !Array.isArray(props.questions.categories)) {
        questionData.value = []
        return
    }
    questionData.value = props.questions.categories.map(c => ({ name: c.name, questions: c.questions }))
}

const onDialogBeforeHide = () => {

}

const props = defineProps({
    questions: Object
})

//const emit = defineEmits(['save-changes'])

</script>

<style scoped lang="scss">
.question-settings-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60% !important;
    padding: 2rem 3rem;
    background-color: $dark;
    gap: 2rem;
}

.question-data-table {
    width: 100%;
}

.categories-table {
    max-height: 60vh;
}

.buttons {
    display: flex;
    flex-direction: row;
    gap: 2rem;
}
</style>
