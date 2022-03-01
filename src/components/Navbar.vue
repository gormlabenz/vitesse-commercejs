<template>
    <!-- a navbar component made with tailwind -->
    <nav class="shadow-md">
        <div class="container mx-auto flex h-12 items-center justify-between">
            <div class="flex items-center">
                <div class="flex items-center">
                    <router-link to="/" class="flex items-center">
                        <span class="text-xl font-semibold text-gray-900"
                            >Vitesse | CommerceJS</span
                        >
                    </router-link>
                </div>
            </div>
            <div class="hidden md:block">
                <div class="ml-4 flex items-center space-x-4">
                    <router-link
                        to="/cart"
                        class="text-gray-500 hover:text-gray-900"
                    >
                        <b class="text-red-500">{{ totalItems }}</b>
                        Cart</router-link
                    >
                </div>
            </div>
        </div>
    </nav>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const totalItems = computed(() =>
    commerceStore.ready ? commerceStore.cart.total_items : 0
)
</script>
<style lang=""></style>
