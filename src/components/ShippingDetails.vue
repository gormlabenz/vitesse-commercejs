<template>
    <form ref="form">
        <label for="fullname">Full name</label>
        <input
            type="text"
            v-model="commerceStore.shipping.name"
            name="name"
            placeholder="Enter your shipping full name"
            required
            minlength="2"
        />
        <label for="street">Street address</label>
        <input
            type="text"
            v-model="commerceStore.shipping.street"
            name="street"
            placeholder="Enter your street address"
            required
            minlength="2"
        />
        <label for="city">City</label>
        <input
            type="text"
            v-model="commerceStore.shipping.city"
            name="city"
            placeholder="Enter your city"
            required
            minlength="2"
        />
        <label for="postalZipCode">Postal/Zip code</label>
        <input
            type="string"
            v-model="commerceStore.shipping.postalZipCode"
            name="postalZipCode"
            placeholder="Enter your postal/zip code"
            required
        />
        <label for="country">Country</label>
        <select v-model="commerceStore.shipping.country" name="country">
            <option value="" disabled>Country</option>
            <option
                v-for="(country, index) in commerceStore.countries"
                :value="index"
                :key="index"
            >
                {{ country }}
            </option>
        </select>
        <label for="shippingOption">Shipping method</label>
        <select
            v-model="commerceStore.fulfillment.shippingOption"
            name="shippingOption"
            @change="commerceStore.validateShippingOption()"
        >
            <option value="" disabled>Select a shipping method</option>
            <option
                class="checkout__select-option"
                v-for="(method, index) in commerceStore.shippingOptions"
                :value="method.id"
                :key="index"
            >
                {{
                    `${method.description} - $${method.price.formatted_with_code}`
                }}
            </option>
        </select>
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
