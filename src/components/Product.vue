<template>
    <router-link :to="'/product/' + product.id" class="w-64 text-left">
        <h3 class="text-xl font-bold">{{ product.name }}</h3>
        <p v-html="product.description"></p>
    </router-link>
</template>
<script setup>
const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
})
const { product } = toRefs(props)
</script>
<style lang=""></style>
