<template>
    <form class="flex flex-col">
        <h4 class="text-2xl font-bold">Customer information</h4>

        <label for="firstName">First name</label>
        <input
            type="text"
            v-model="commerceStore.checkoutForm.customer.firstName"
            name="firstName"
            placeholder="Enter your first name"
            required
        />

        <label for="lastName">Last name</label>
        <input
            type="text"
            v-model="commerceStore.checkoutForm.customer.lastName"
            name="lastName"
            placeholder="Enter your last name"
            required
        />

        <label for="email">Email</label>
        <input
            type="text"
            v-model="commerceStore.checkoutForm.customer.email"
            name="email"
            placeholder="Enter your email"
            required
        />

        <h4>Shipping details</h4>

        <label for="fullname">Full name</label>
        <input
            type="text"
            v-model="commerceStore.checkoutForm.shipping.name"
            name="name"
            placeholder="Enter your shipping full name"
            required
        />

        <label for="street">Street address</label>
        <input
            type="text"
            v-model="commerceStore.checkoutForm.shipping.street"
            name="street"
            placeholder="Enter your street address"
            required
        />

        <label for="city">City</label>
        <input
            type="text"
            v-model="commerceStore.checkoutForm.shipping.city"
            name="city"
            placeholder="Enter your city"
            required
        />

        <label for="postalZipCode">Postal/Zip code</label>
        <input
            type="text"
            v-model="commerceStore.checkoutForm.shipping.postalZipCode"
            name="postalZipCode"
            placeholder="Enter your postal/zip code"
            required
        />
        <label for="country">Country</label>
        <select
            v-model="commerceStore.checkoutForm.shipping.country"
            name="country"
            @change="commerceStore.fetchShippingSubdivisions()"
        >
            <option value="" disabled>Country</option>
            <option
                v-for="(country, index) in commerceStore.countries"
                :value="index"
                :key="index"
            >
                {{ country }}
            </option>
        </select>
        <label for="stateProvince">State/province</label>
        <select
            v-model="commerceStore.checkoutForm.shipping.stateProvince"
            name="stateProvince"
            @change="commerceStore.fetchShippingOptions()"
        >
            <option value="" disabled>State/province</option>
            <option
                v-for="(
                    subdivision, index
                ) in commerceStore.shippingSubdivisions"
                :value="index"
                :key="index"
            >
                {{ subdivision }}
            </option>
        </select>
        <label for="shippingOption">Shipping method</label>
        <select
            v-model="commerceStore.checkoutForm.fulfillment.shippingOption"
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

        <h4>Payment information</h4>

        <label for="cardNum">Credit card number</label>
        <input
            type="text"
            name="cardNum"
            v-model="commerceStore.checkoutForm.payment.cardNum"
            placeholder="Enter your card number"
        />

        <label for="expMonth">Expiry month</label>
        <input
            type="text"
            name="expMonth"
            v-model="commerceStore.checkoutForm.payment.expMonth"
            placeholder="Card expiry month"
        />

        <label for="expYear">Expiry year</label>
        <input
            type="text"
            name="expYear"
            v-model="commerceStore.checkoutForm.payment.expYear"
            placeholder="Card expiry year"
        />

        <label for="ccv">CCV</label>
        <input
            type="text"
            name="ccv"
            v-model="commerceStore.checkoutForm.payment.ccv"
            placeholder="CCV (3 digits)"
        />

        <button
            class="bg-red-300 px-4 py-2"
            @click.prevent="commerceStore.handleConfirmOrder()"
        >
            Confirm order
        </button>
    </form>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

/* onMounted(() => {
    if (commerceStore.checkoutToken === null) {
        return
    }
    if (commerceStore.checkoutForm.shipping.country) {
        commerceStore.fetchShippingSubdivisions()
    }
    commerceStore.getLiveObject()
})

watch(
    commerceStore.checkoutForm.fulfillment.shippingOption,
    (newVal, oldVal) => {
        if (newVal === oldVal) {
            return
        }
        commerceStore.validateShippingOption()
    }
) */
</script>
<style scoped></style>
