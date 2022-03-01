<template>
    <div ref="container">
        <div>
            <!-- Customer data -->
            <div class="flex flex-col justify-between space-y-4">
                <div>
                    <h3 class="font-bold text-gray-500">Customer</h3>
                    <div class="text-gray-500">
                        {{ commerceStore.customer.firstName }}
                        {{ commerceStore.customer.lastName }}
                    </div>
                    <div class="text-gray-500">
                        {{ commerceStore.customer.email }}
                    </div>
                </div>
                <div>
                    <h3 class="font-bold text-gray-500">Shipping</h3>
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
                        {{ commerceStore.shipping.postalZipCode }}
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
                <p class="text-gray-500">Pay with paypal</p>
                <div class="my-4 flex w-full justify-center">
                    <div id="paypal-button-container"></div>
                </div>
            </div>
            <div class="mt-16">
                <h4 class="text-xl font-bold">Credit Card</h4>
                <p class="text-gray-500">Pay with credit card</p>
                <form class="mt-6 flex flex-col">
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
                </form>
                <button
                    class="mt-4 whitespace-nowrap"
                    @click.prevent="validate(summary)"
                >
                    Pay €{{ parseFloat(commerceStore.totalPrice) }}
                    with credit card
                </button>
            </div>
        </div>
    </div>
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
