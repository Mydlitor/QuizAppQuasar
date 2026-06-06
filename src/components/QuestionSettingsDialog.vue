<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow" no-backdrop-dismiss
        no-shake ref="qDialogRef" class="q-dialog">
        <div class="dialog-main">
            <div class="game-global-settings">
                <div class="title-settings">
                    <span style="font-size: larger; margin-right: 0.5rem;">Title: </span>
                    <span style="font-size: larger;">{{ questionData.settings.gameName }}</span>
                    <q-popup-edit v-model="questionData.settings.gameName" auto-save v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus borderless @keyup.enter="scope.set" />
                    </q-popup-edit>
                </div>
                <div class="answer-time-settings">
                    <span style="font-size: larger; margin-right: 0.5rem;">Answer time [s]: </span>
                    <span style="font-size: larger;">{{ questionData.settings.answerTime }}</span>
                    <q-popup-edit v-model="questionData.settings.answerTime" auto-save v-slot="scope">
                        <q-input v-model.number="scope.value" type="number" dense autofocus borderless
                            @keyup.enter="scope.set" />
                    </q-popup-edit>
                </div>


            </div>
            <div class="question-data-table">
                <q-table class="categories-table" :columns="columns" :rows="questionData.categories" row-key="name"
                    hide-pagination flat bordered separator="cell" :rows-per-page-options="[0]" virtual-scroll>
                    <template v-slot:body="props">
                        <q-tr :props="props" @click="onRowClick(props)"
                            @contextmenu.prevent="onCategoryRowContextMenu($event, props.rowIndex)">
                            <q-td key="index" :props="props" style="width: 20%;">
                                <div class="index-container">
                                    {{ props.rowIndex + 1 }}
                                    <div class="move-buttons-container">
                                        <q-btn :disable="props.rowIndex <= 0" size="xs"
                                            @click.stop="onMoveCategoryUp(props.rowIndex)">
                                            <q-icon :name="matKeyboardArrowUp" size="xs" />
                                        </q-btn>
                                        <q-btn :disable="props.rowIndex >= questionData.categories.length - 1" size="xs"
                                            @click.stop="onMoveCategoryDown(props.rowIndex)">
                                            <q-icon :name="matKeyboardArrowDown" size="xs" />
                                        </q-btn>
                                    </div>
                                </div>
                            </q-td>
                            <q-td key="name" :props="props" @dblclick.stop="onCategoryDblClick(props.rowIndex)">
                                {{ props.row.name }}
                                <q-popup-edit v-model="props.row.name" auto-save v-slot="scope" no-parent-event
                                    :validate="validateCategoryName"
                                    :ref="el => setCategoryPopupRef(props.rowIndex, el)">
                                    <q-input v-model="scope.value" dense autofocus borderless :error="categoriesError"
                                        :error-message="categoriesErrorMessage" @keyup.enter="scope.set" />
                                </q-popup-edit>
                            </q-td>
                            <q-td key="questionsCount" :props="props" style="width: 20%;">
                                {{ props.row.questions.length }}
                            </q-td>
                        </q-tr>
                        <q-tr v-show="props.expand" :props="props">
                            <q-td colspan="100%">
                                <q-table :columns="questionColumns" :rows="props.row.questions" row-key="id"
                                    hide-pagination flat bordered separator="cell" :rows-per-page-options="[0]">
                                    <template v-slot:body="questionProps">
                                        <q-tr :props="questionProps"
                                            @contextmenu.prevent.stop="onQuestionRowContextMenu($event, props.rowIndex, questionProps.rowIndex)">
                                            <q-td key="index" :props="questionProps" style="width: 20%;">
                                                <div class="index-container">
                                                    {{ questionProps.rowIndex + 1 }}
                                                    <div class="move-buttons-container">
                                                        <q-btn :disable="questionProps.rowIndex <= 0" size="xs"
                                                            @click.stop="onMoveQuestionUp(props.rowIndex, questionProps.rowIndex)">
                                                            <q-icon :name="matKeyboardArrowUp" size="xs" />
                                                        </q-btn>
                                                        <q-btn
                                                            :disable="questionProps.rowIndex >= questionData.categories[questionProps.rowIndex].questions.length"
                                                            size="xs"
                                                            @click.stop="onMoveQuestionDown(props.rowIndex, questionProps.rowIndex)">
                                                            <q-icon :name="matKeyboardArrowDown" size="xs" />
                                                        </q-btn>
                                                    </div>
                                                </div>
                                            </q-td>
                                            <q-td key="text" :props="questionProps"
                                                @dblclick.stop="onQuestionDblClick(props.rowIndex, questionProps.rowIndex)">
                                                {{ questionProps.row.text }}
                                                <q-popup-edit v-model="questionProps.row.text" auto-save v-slot="scope"
                                                    no-parent-event :validate="validateQuestionText"
                                                    :ref="el => setQuestionPopupRef(props.rowIndex, questionProps.rowIndex, el)">
                                                    <q-input v-model="scope.value" dense autofocus borderless
                                                        :error="questionsError" :error-message="questionsErrorMessage"
                                                        @keyup.enter="scope.set" />
                                                </q-popup-edit>
                                            </q-td>
                                        </q-tr>
                                    </template>
                                    <template v-slot:bottom-row>
                                        <q-tr>
                                            <q-td colspan="100%" style="text-align: center; cursor: pointer;"
                                                @click="onAddQuestion(props.rowIndex)">
                                                <q-icon :name="matAddCircle" style="margin-right: 0.5rem;" />
                                                <span>ADD QUESTION</span>
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
                <q-btn label="RESET GAME PROGRESS" @click="onGameProgressReset" />
            </div>
        </div>
        <q-menu ref="categoryContextMenuRef" anchor="top left" self="top left" context-menu auto-close>
            <q-list>
                <q-item clickable v-close-popup @click="onRemoveCategory">
                    <q-item-section>REMOVE CATEGORY</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
        <q-menu ref="questionContextMenuRef" anchor="top left" self="top left" context-menu auto-close>
            <q-list>
                <q-item clickable v-close-popup @click="onRemoveQuestion">
                    <q-item-section>REMOVE QUESTION</q-item-section>
                </q-item>
            </q-list>
        </q-menu>
    </q-dialog>
</template>

<script setup>
import { ref } from 'vue';

import { useQuasar } from 'quasar';
import { matAddCircle, matKeyboardArrowDown, matKeyboardArrowUp } from '@quasar/extras/material-icons'

const $q = useQuasar();


const questionData = ref(null)
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
const selectedContextCategoryIndex = ref(-1)
const selectedContextQuestionIndex = ref(-1)
const categoryContextMenuRef = ref(null)
const questionContextMenuRef = ref(null)
const categoryPopupRefs = ref([])
const questionPopupRefs = ref([])
const categoriesError = ref(false)
const categoriesErrorMessage = ref('')
const questionsError = ref(false)
const questionsErrorMessage = ref('')
const clickTimer = ref(null)
const clickDelay = 200

const onRowClick = (props) => {
    if (clickTimer.value) {
        clearTimeout(clickTimer.value)
        clickTimer.value = null
    }
    clickTimer.value = setTimeout(() => {
        props.expand = !props.expand
        clickTimer.value = null
    }, clickDelay)
}

const onMoveCategoryUp = (index) => {
    if (index <= 0)
        return;
    [questionData.value.categories[index - 1], questionData.value.categories[index]] = [questionData.value.categories[index], questionData.value.categories[index - 1]]
}

const onMoveCategoryDown = (index) => {
    if (index >= questionData.value.categories.length - 1)
        return;
    [questionData.value.categories[index + 1], questionData.value.categories[index]] = [questionData.value.categories[index], questionData.value.categories[index + 1]]
}

const onMoveQuestionUp = (catIndex, index) => {
    if (index <= 0)
        return;
    [questionData.value.categories[catIndex].questions[index - 1], questionData.value.categories[catIndex].questions[index]] =
        [questionData.value.categories[catIndex].questions[index], questionData.value.categories[catIndex].questions[index - 1]]
}

const onMoveQuestionDown = (catIndex, index) => {
    if (index >= questionData.value.categories.length - 1)
        return;
    [questionData.value.categories[catIndex].questions[index + 1], questionData.value.categories[catIndex].questions[index]] =
        [questionData.value.categories[catIndex].questions[index], questionData.value.categories[catIndex].questions[index + 1]]
}

const onCategoryRowContextMenu = (event, categoryIndex) => {
    selectedContextCategoryIndex.value = categoryIndex;
    categoryContextMenuRef.value?.show(event)
}

const onQuestionRowContextMenu = (event, categoryIndex, questionIndex) => {
    selectedContextCategoryIndex.value = categoryIndex;
    selectedContextQuestionIndex.value = questionIndex;
    questionContextMenuRef.value?.show(event)
}

const onRemoveCategory = () => {
    if (selectedContextCategoryIndex.value === -1) {
        return;
    }
    questionData.value.categories.splice(selectedContextCategoryIndex.value, 1)
}

const onRemoveQuestion = () => {
    if (selectedContextCategoryIndex.value === -1 || selectedContextQuestionIndex.value === -1) {
        return;
    }
    questionData.value.categories[selectedContextCategoryIndex.value].questions.splice(selectedContextQuestionIndex.value, 1)
}

const onCategoryDblClick = (rowIndex) => {
    if (clickTimer.value) {
        clearTimeout(clickTimer.value)
        clickTimer.value = null
    }
    showCategoryPopup(rowIndex)
}

const onQuestionDblClick = (catIndex, qIndex) => {
    if (clickTimer.value) {
        clearTimeout(clickTimer.value)
        clickTimer.value = null
    }
    showQuestionPopup(catIndex, qIndex)
}

const onAddCategory = () => {
    questionData.value.categories.push({ name: "NEW CATEGORY", questions: [] })
}

const onAddQuestion = (catIndex) => {
    if (catIndex != -1)
        questionData.value.categories[catIndex].questions.push({ text: "NEW QUESTION" })
}

const setCategoryPopupRef = (index, el) => {
    categoryPopupRefs.value[index] = el
}

const showCategoryPopup = (index) => {
    categoryPopupRefs.value[index]?.show()
}

const validateCategoryName = (val) => {
    if (questionData.value.categories.some(c => c.name === val)) {
        categoriesError.value = true
        categoriesErrorMessage.value = 'EACH CATEGORY MUST HAVE UNIQUE NAME'
        return false
    }
    categoriesError.value = false
    categoriesErrorMessage.value = ''
    return true
}

const setQuestionPopupRef = (catIndex, qIndex, el) => {
    questionPopupRefs.value[`${catIndex}-${qIndex}`] = el
}

const showQuestionPopup = (catIndex, qIndex) => {
    questionPopupRefs.value[`${catIndex}-${qIndex}`]?.show()
}

const validateQuestionText = (val) => {
    if (!val || !val.toString().trim()) {
        questionsError.value = true
        questionsErrorMessage.value = 'QUESTION TEXT CANNOT BE EMPTY'
        return false
    }
    questionsError.value = false
    questionsErrorMessage.value = ''
    return true
}

const validateAllCategories = () => {
    let nameSet = new Set(questionData.value.categories.map(t => t.name))
    if (nameSet.size != questionData.value.categories.length) {
        return false;
    }
    return true;
}

const onSave = () => {
    if (validateAllCategories() === false) {
        $q.notify({
            message: "EACH CATEGORY MUST HAVE UNIQUE NAME"
        })
        return;
    }
    emit('save-changes', questionData.value)
    qDialogRef.value.hide()
}

const onCancel = () => {
    qDialogRef.value.hide()
}

const onGameProgressReset = () => {
    emit('reset-progress')
    qDialogRef.value.hide()
}

const onDialogBeforeShow = () => {
    if (!props.questions) {
        questionData.value = null
        return
    }
    questionData.value = JSON.parse(JSON.stringify(props.questions))
}

const onDialogBeforeHide = () => {

}

const props = defineProps({
    questions: Object
})

const emit = defineEmits(['save-changes', 'reset-progress'])

</script>

<style scoped lang="scss">
.dialog-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60% !important;
    padding: 2rem 3rem;
    background-color: $dark;
    gap: 2rem;
}

.game-global-settings {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 80%;
}

.question-data-table {
    width: 100%;
}

.categories-table {
    max-height: 60vh;
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
</style>
