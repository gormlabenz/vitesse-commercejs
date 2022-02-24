<template>
    <div class="flex flex-wrap gap-8">
        <Preview
            class="w-64 text-left"
            v-for="product in products"
            :key="product"
            :product="product"
        >
        </Preview>
    </div>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'
import Preview from './Preview.vue'

const commerceStore = useCommerceStore()

const products = computed(() => commerceStore.products.data || [])
</script>
<style lang=""></style>
