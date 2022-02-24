<template>
    <button @click="open = !open" class="bg-yellow-300 px-4 py-2">
        Products in Cart: {{ totalItems }}
    </button>
    <div v-if="open">
        <div
            class="flex w-96 justify-between space-y-2"
            v-for="item in lineItems"
            :key="item"
        >
            <p>{{ item.name }} {{ item.price.formatted_with_symbol }}</p>
            <button
                @click="commerceStore.removeFromCart(item)"
                class="bg-red-500 text-white"
            >
                Remove
            </button>
        </div>
        <p>€{{ commerceStore.totalPrice }}</p>
    </div>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const totalItems = computed(() =>
    !commerceStore.cart.isLoading ? commerceStore.cart.data.total_items : 0
)

const lineItems = computed(() =>
    !commerceStore.cart.isLoading ? commerceStore.cart.data.line_items : []
)

const open = ref(false)
</script>
