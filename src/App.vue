<script setup>
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
    title: 'Vitesse - CommerceJS',
    meta: [
        {
            name: 'description',
            content: 'Opinionated Vite Starter Template width CommerceJS',
        },
    ],
})
</script>

<template>
    <Navbar></Navbar>
    <div class="container mx-auto">
        <router-view />
    </div>
</template>
