<template>
    <button
        @click="checkout"
        class="absolute top-0 right-0 bg-green-300 px-4 py-2"
        :class="{ 'pointer-events-none opacity-25': !emtpy }"
    >
        Checkout
    </button>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const emtpy = computed(() =>
    commerceStore.cart ? commerceStore.cart.total_items !== 0 : false
)

const router = useRouter()

const checkout = () => {
    commerceStore.checkout()
    router.push('/checkout')
}
</script>
<style lang=""></style>
