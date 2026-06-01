<template>
    <q-layout view="hhh lpr fFf">
        <q-page-container>
            <router-view />
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
const $q = useQuasar()
$q.dark.set(true)
$q.fullscreen.request()
    .then(() => {
        console.log("fullscreen")
    })
    .catch(err => {
        console.error(err)
    })
</script>

<style>
html {
    overflow: auto;
    height: 100%;
}

* {
    user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
}
</style>
