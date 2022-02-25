<template>
    <a
        :href="url"
        class="absolute top-0 right-0 bg-green-300 px-4 py-2"
        :class="{ 'pointer-events-none opacity-25': !emtpy }"
    >
        Checkout
    </a>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const url = computed(() =>
    commerceStore.cart.data ? commerceStore.cart.data.hosted_checkout_url : ''
)

const emtpy = computed(() =>
    commerceStore.cart.data ? commerceStore.cart.data.total_items !== 0 : false
)
</script>
<style lang=""></style>
