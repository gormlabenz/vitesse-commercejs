<template>
    <div>
        <div v-if="product">
            <h1 class="text-2xl font-bold">{{ product.name }}</h1>
            <p v-html="product.description"></p>
            <button
                @click="commerceStore.addToCart(product)"
                class="bg-blue-300 py-2 px-4"
            >
                Add To Card
            </button>
        </div>
    </div>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const { id } = toRefs(props)

const product = computed(() =>
    !commerceStore.products.isLoading
        ? commerceStore.products.data.find((product) => product.id === id.value)
        : null
)
</script>
