<template>
    <div class="my-8">
        <h4 class="text-2xl font-bold">
            Products in Cart: {{ commerceStore.totalItems }}
        </h4>
        <div class="mt-3 divide-y-2 divide-slate-400">
            <div
                class="flex justify-between space-y-2"
                v-for="item in lineItems"
                :key="item"
            >
                <div class="flex items-center space-x-3">
                    <p>{{ item.name }}</p>
                    <p>|</p>
                    <p>Quantity: {{ item.quantity }}</p>
                    <button
                        @click="commerceStore.removeFromCart(item)"
                        class="text-red-500"
                    >
                        Remove
                    </button>
                </div>
                <p>{{ item.price.formatted_with_symbol }}</p>
            </div>
        </div>
        <div class="relative mt-3">
            <div class="absolute right-0 flex flex-col items-end space-y-4">
                <p class="font-bold text-red-500">
                    €{{ commerceStore.totalPrice }}
                </p>
                <router-link
                    to="/checkout"
                    class="rounded-md bg-blue-300 px-4 py-2 font-bold text-white"
                >
                    Buy
                </router-link>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const lineItems = computed(() =>
    commerceStore.ready ? commerceStore.cart.line_items : []
)
</script>
