<template>
    <div style="width: 800px; height: 800px;">
        <p>Build the vue App</p>
        <p>Go to chrome extensions panel</p>
        <p>Charger l'extension non empaqueté</p>
        <p>Diriger vers le dossier /dist</p>

        <p>L'app vue est seulement pour la partie quand on clique sur la pastille de l'extension dans la barre de tache</p>
        <p>L'extension elle meme est contenue dans le dossier /public</p>
        <dino></dino>
    </div>
</template>

<script lang="ts">

import dino from './components/dino.vue';
export default {
    setup() {
    },
    components: { dino }
}
</script>

<style></style>