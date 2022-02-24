<template>
    <div>
        <h2>{{ product.name }}</h2>
        <p v-html="product.description"></p>
        <button
            @click="commerceStore.addToCart(product)"
            class="bg-blue-300 py-2 px-4"
        >
            Add To Card
        </button>
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
    commerceStore.products.data.find((product) => product.id === id.value)
)
</script>
