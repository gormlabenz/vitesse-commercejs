<template>
    <div class="my-8 flex justify-start gap-8">
        <div class="relative w-96 space-y-8 rounded-md p-4 shadow-md">
            <div>
                <h3
                    :class="
                        stage == 0
                            ? 'text-2xl font-bold text-gray-900'
                            : 'text-gray-500'
                    "
                >
                    1. Customer information
                </h3>
                <h3
                    :class="
                        stage == 1
                            ? 'text-2xl font-bold text-gray-900'
                            : 'text-gray-500'
                    "
                >
                    2. Shipping details
                </h3>
                <h3
                    :class="
                        stage == 2
                            ? 'text-2xl font-bold text-gray-900'
                            : 'text-gray-500'
                    "
                >
                    3. Summary
                </h3>
            </div>
            <div>
                <div>
                    <form ref="customerInformation" v-show="stage == 0">
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
                    <form ref="shippingDetails" v-show="stage == 1">
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
                        <select
                            v-model="commerceStore.shipping.country"
                            name="country"
                        >
                            <option value="" disabled>Country</option>
                            <option
                                v-for="(
                                    country, index
                                ) in commerceStore.countries"
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
                            <option value="" disabled>
                                Select a shipping method
                            </option>
                            <option
                                class="checkout__select-option"
                                v-for="(
                                    method, index
                                ) in commerceStore.shippingOptions"
                                :value="method.id"
                                :key="index"
                            >
                                {{
                                    `${method.description} - $${method.price.formatted_with_code}`
                                }}
                            </option>
                        </select>
                        <button
                            class="mt-4"
                            @click.prevent="validate(shippingDetails)"
                        >
                            Next
                        </button>
                    </form>
                    <div ref="summary" v-show="stage == 2">
                        <div>
                            <!-- Customer data -->
                            <div
                                class="flex flex-col justify-between space-y-4"
                            >
                                <div>
                                    <h3 class="font-bold text-gray-500">
                                        Customer
                                    </h3>
                                    <div class="text-gray-500">
                                        {{ commerceStore.customer.firstName }}
                                        {{ commerceStore.customer.lastName }}
                                    </div>
                                    <div class="text-gray-500">
                                        {{ commerceStore.customer.email }}
                                    </div>
                                </div>
                                <div>
                                    <h3 class="font-bold text-gray-500">
                                        Shipping
                                    </h3>
                                    <div class="text-gray-500">
                                        {{ commerceStore.shipping.name }}
                                    </div>
                                    <div class="text-gray-500">
                                        {{ commerceStore.shipping.street }}
                                    </div>
                                    <div class="text-gray-500">
                                        {{ commerceStore.shipping.city }}
                                    </div>
                                    <div class="text-gray-500">
                                        {{
                                            commerceStore.shipping.postalZipCode
                                        }}
                                    </div>
                                    <div class="text-gray-500">
                                        {{ commerceStore.shipping.country }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4">
                            <div>
                                <h4 class="text-xl font-bold">Paypal</h4>
                                <div id="paypal-button-container"></div>
                            </div>
                            <div>
                                <h4 class="text-xl font-bold">Credit Card</h4>
                                <form class="mt-6 flex flex-col">
                                    <label for="cardNum"
                                        >Credit card number</label
                                    >
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
                                </form>
                                <button
                                    class="mt-4"
                                    @click.prevent="validate(summary)"
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
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

const stage = ref(0)

const customerInformation = ref(null)
const shippingDetails = ref(null)
const summary = ref(null)

const validate = (form) => {
    if (form.checkValidity()) {
        if (stage.value == 0) {
            stage.value++
        } else if (stage.value == 1) {
            stage.value++
            commerceStore.getPaypalPaymentId()
        } else if (stage.value == 2) {
            commerceStore.captureOrder()
        }
    } else {
        const inputs = form.querySelectorAll('input')
        inputs.forEach((input) => {
            input.classList.add('invalid:border-red-500', 'invalid:border-2')
        })
    }
}
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
