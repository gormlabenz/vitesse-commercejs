<template>
    <div class="my-8">
        <div class="flex gap-4">
            <div
                class="h-96 w-96 rounded-md bg-gray-200"
                v-for="i in 3"
                :key="i"
            ></div>
        </div>
        <div class="mt-8" v-if="product">
            <h1 class="text-2xl font-bold">{{ product.name }}</h1>
            <p class="mt-4 w-96" v-html="product.description"></p>
            <button
                @click="commerceStore.addToCart(product)"
                class="mt-4 rounded-md bg-blue-300 py-2 px-4 font-bold text-white"
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
    permalink: {
        type: String,
        required: true,
    },
})

const { permalink } = toRefs(props)

const product = computed(() =>
    commerceStore.ready
        ? commerceStore.products.find(
              (product) => product.permalink === permalink.value
          )
        : null
)
</script>
