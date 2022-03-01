<template>
    <!-- a shopping cart that opens when clicked implemented with Tailwind -->
    <div
        class="absolute top-0 right-0 z-20 w-96 whitespace-nowrap rounded-md bg-white p-4 shadow-md"
    >
        <h4 class="text-xl">Your Cart</h4>
        <p>
            Products in Cart: <b>{{ commerceStore.totalItems }}</b>
        </p>
        <div class="mt-3 divide-y-2 divide-slate-400">
            <div
                class="flex justify-between space-y-2"
                v-for="item in commerceStore.lineItems"
                :key="item"
            >
                <div class="flex items-center space-x-3">
                    <p>{{ item.name }}</p>

                    <button
                        @click="commerceStore.removeFromCart(item)"
                        class="text-red-500"
                    >
                        remove
                    </button>
                </div>
                <p>{{ item.price.formatted_with_symbol }}</p>
            </div>
            <!-- totalPrice -->
            <div class="relative">
                <div class="flex flex-col items-end space-y-4">
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
    </div>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()
</script>
<style lang=""></style>
