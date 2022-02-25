<template>
    <div class="flex flex-wrap gap-8">
        <Product
            class="w-64 text-left"
            v-for="product in products"
            :key="product"
            :product="product"
        >
        </Product>
    </div>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const products = computed(() => commerceStore.products || [])
</script>
