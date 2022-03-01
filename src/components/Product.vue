<template>
    <router-link
        :to="'/product/' + product.permalink"
        class="w-64 overflow-hidden rounded-md text-left shadow-md"
        ><div class="h-48 bg-gray-200"></div>
        <div class="p-4">
            <h3 class="text-xl font-bold">{{ product.name }}</h3>
            <p>{{ product.price.formatted_with_code }}</p>
        </div>
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
