<template>
    <q-dialog full-width @before-hide="onDialogBeforeHide" @before-show="onDialogBeforeShow" no-backdrop-dismiss
        no-shake ref="qDialogRef">
        <div class="dialog-main" ref="dialogDivRef">
            {{ props.teams }}
        </div>
    </q-dialog>
</template>

<script setup>

const props = defineProps({
    teams: Object,
})
</script>

<style lang="scss">
.dialog-main {
    height: 80%;
    width: 80% !important;
    background-color: $dark;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: solid 3px transparent;
    transition: border-color 200ms ease;
}
</style>
