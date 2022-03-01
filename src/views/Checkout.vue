<template>
    <div class="my-8 flex justify-start gap-8">
        <div class="relative w-96 space-y-8 rounded-md p-4 shadow-md">
            <div class="flex flex-col items-start">
                <button
                    @click="commerceStore.stage = 0"
                    :class="
                        commerceStore.stage == 0
                            ? 'text-2xl font-bold text-gray-900'
                            : 'text-gray-500 hover:text-gray-900'
                    "
                >
                    1. Customer information
                </button>
                <button
                    @click="commerceStore.stage = 1"
                    :class="
                        commerceStore.stage == 1
                            ? 'text-2xl font-bold text-gray-900'
                            : 'text-gray-500 hover:text-gray-900'
                    "
                >
                    2. Shipping details
                </button>
                <button
                    @click="commerceStore.stage = 2"
                    :class="
                        commerceStore.stage == 2
                            ? 'text-2xl font-bold text-gray-900'
                            : 'text-gray-500 hover:text-gray-900'
                    "
                >
                    3. Summary
                </button>
            </div>
            <div>
                <div>
                    <div v-show="commerceStore.stage == 0">
                        <CustomerInformation />
                    </div>
                    <div v-show="commerceStore.stage == 1">
                        <ShippingDetails />
                    </div>

                    <div v-show="commerceStore.stage == 2">
                        <Summary />
                    </div>
                </div>
            </div>
        </div>
        <div
            class="relative w-96 space-y-8 whitespace-nowrap rounded-md p-4 shadow-md"
        >
            <h4 class="text-2xl font-bold">
                Products in Cart: {{ commerceStore.totalItems }}
            </h4>
            <div class="mt-3 divide-y-2 divide-slate-400">
                <div
                    class="flex justify-between space-y-2"
                    v-for="item in commerceStore.lineItems"
                    :key="item"
                >
                    <div class="flex w-full flex-col">
                        <p>{{ item.name }}</p>
                        <p>Quantity: {{ item.quantity }}</p>
                        <div class="flex justify-between">
                            <p
                                @click="commerceStore.removeFromCart(item)"
                                class="text-red-500"
                            >
                                Remove
                            </p>
                            <p>{{ item.price.formatted_with_symbol }}</p>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div
                        class="absolute right-0 flex flex-col items-end space-y-4"
                    >
                        <p class="font-bold text-red-500">
                            €{{ commerceStore.totalPrice }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()
</script>
