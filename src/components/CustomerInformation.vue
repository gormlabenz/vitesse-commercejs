<template>
    <form ref="form">
        <label for="firstName">First name</label>
        <input
            type="text"
            v-model="commerceStore.customer.firstName"
            name="firstName"
            placeholder="Enter your first name"
            required
            minlength="2"
        />
        <label for="lastName">Last name</label>
        <input
            type="text"
            v-model="commerceStore.customer.lastName"
            name="lastName"
            placeholder="Enter your last name"
            required
            minlength="2"
        />
        <label for="email">Email</label>
        <input
            type="email"
            v-model="commerceStore.customer.email"
            name="email"
            placeholder="Enter your email"
            required
        />
        <button class="mt-4" @click.prevent="commerceStore.validateForm(form)">
            Next
        </button>
    </form>
</template>

<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const form = ref(null)
</script>
<style scoped>
input {
    @apply mb-4 block w-full rounded-md border border-gray-200 p-2;
}
select {
    @apply mb-4 block w-full rounded-md border border-gray-200 p-2;
}
button {
    margin-left: 100%;
    @apply -translate-x-full rounded-md bg-blue-500 py-2 px-4 font-bold
        text-white;
}
</style>
