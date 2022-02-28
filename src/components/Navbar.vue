<template>
    <!-- a navbar component made with tailwind -->
    <nav>
        <div class="container mx-auto flex h-16 items-center justify-between">
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
                        >Cart</router-link
                    >
                    <router-link
                        to="/checkout"
                        class="text-gray-500 hover:text-gray-900"
                        >Checkout</router-link
                    >
                </div>
            </div>
        </div>
    </nav>
</template>
<script setup></script>
<style lang=""></style>
