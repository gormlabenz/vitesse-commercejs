<template>
    <div class="flex space-x-12">
        <div class="flex flex-col items-start">
            <button
                :class="{ 'text-2xl font-bold text-gray-900': stage == 0 }"
                class="text-gray-500 hover:text-gray-900"
                @click="stage = 0"
            >
                1. Customer information
            </button>
            <button
                :class="{ 'text-2xl font-bold text-gray-900': stage == 1 }"
                class="text-gray-500 hover:text-gray-900"
                @click="stage = 1"
            >
                2. Shipping details
            </button>
            <button
                :class="{ 'text-2xl font-bold text-gray-900': stage == 2 }"
                class="text-gray-500 hover:text-gray-900"
                @click="stage = 2"
            >
                3. Payment information
            </button>
        </div>
        <div>
            <form
                ref="customerInformation"
                class="flex flex-col"
                v-show="stage == 0"
            >
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
                <button
                    class="mt-4"
                    @click.prevent="validate(customerInformation)"
                >
                    Next
                </button>
            </form>
            <form
                ref="shippingDetails"
                class="flex flex-col"
                v-show="stage == 1"
            >
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
                    type="number"
                    v-model="commerceStore.shipping.postalZipCode"
                    name="postalZipCode"
                    placeholder="Enter your postal/zip code"
                    required
                />
                <label for="country">Country</label>
                <select
                    v-model="commerceStore.shipping.country"
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
                    v-model="commerceStore.shipping.stateProvince"
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
                <button class="mt-4" @click.prevent="validate(shippingDetails)">
                    Next
                </button>
            </form>
            <form
                ref="paymentInformation"
                class="flex flex-col"
                v-show="stage == 2"
            >
                <div class="flex items-center space-x-3">
                    <div>
                        <label for="paypal">Paypal </label>
                        <input
                            v-model="commerceStore.paymentMethodPaypal"
                            name="paypal"
                            type="checkbox"
                        />
                    </div>
                    <div>
                        <label for="card">Credit card </label>
                        <input
                            v-model="commerceStore.paymentMethodCard"
                            name="card"
                            type="checkbox"
                        />
                    </div>
                </div>
                <div
                    v-if="commerceStore.paymentMethodPaypal"
                    id="paypal-button-container"
                ></div>
                <div
                    class="mt-6 flex flex-col"
                    v-if="commerceStore.paymentMethodCard"
                >
                    <label for="cardNum">Credit card number</label>
                    <input
                        required
                        type="number"
                        name="cardNum"
                        v-model="commerceStore.payment.cardNum"
                        placeholder="Enter your card number"
                    />
                    <label for="expMonth">Expiry month</label>
                    <input
                        required
                        type="number"
                        name="expMonth"
                        v-model="commerceStore.payment.expMonth"
                        placeholder="Card expiry month"
                    />
                    <label for="expYear">Expiry year</label>
                    <input
                        required
                        type="number"
                        name="expYear"
                        v-model="commerceStore.payment.expYear"
                        placeholder="Card expiry year"
                    />
                    <label for="ccv">CCV</label>
                    <input
                        required
                        type="number"
                        name="ccv"
                        v-model="commerceStore.payment.ccv"
                        placeholder="CCV (3 digits)"
                        minlength="3"
                        maxlength="4"
                    />
                </div>
                <button
                    class="mt-4"
                    @click.prevent="validate(paymentInformation)"
                >
                    Next
                </button>
            </form>
        </div>
    </div>
    <button
        class="bg-orange-300 px-4 py-2"
        @click="commerceStore.validateCheckoutForm()"
    >
        Validate
    </button>
    <button
        class="bg-red-300 px-4 py-2"
        @click.prevent="commerceStore.captureOrder()"
    >
        Confirm order
    </button>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const stage = ref(0)

const customerInformation = ref(null)
const shippingDetails = ref(null)
const paymentInformation = ref(null)

const validate = (form) => {
    if (form.checkValidity()) {
        if (stage.value < 2) stage.value++
        else if (stage.value == 3) commerceStore.captureOrder()
    } else {
        const inputs = form.querySelectorAll('input')
        inputs.forEach((input) => {
            input.classList.add('invalid:border-red-500', 'invalid:border-2')
        })
    }
}
</script>
<style scoped>
h4 {
    @apply text-2xl font-bold;
}
</style>
