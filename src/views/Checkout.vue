<template>
    <form class="checkout__form">
        <h4 class="checkout__subheading">Customer information</h4>

        <label class="checkout__label" for="firstName">First name</label>
        <input
            class="checkout__input"
            type="text"
            v-model="commerceStore.checkoutForm.customer.firstName"
            name="firstName"
            placeholder="Enter your first name"
            required
        />

        <label class="checkout__label" for="lastName">Last name</label>
        <input
            class="checkout__input"
            type="text"
            v-model="commerceStore.checkoutForm.customer.lastName"
            name="lastName"
            placeholder="Enter your last name"
            required
        />

        <label class="checkout__label" for="email">Email</label>
        <input
            class="checkout__input"
            type="text"
            v-model="commerceStore.checkoutForm.customer.email"
            name="email"
            placeholder="Enter your email"
            required
        />

        <h4 class="checkout__subheading">Shipping details</h4>

        <label class="checkout__label" for="fullname">Full name</label>
        <input
            class="checkout__input"
            type="text"
            v-model="commerceStore.checkoutForm.shipping.name"
            name="name"
            placeholder="Enter your shipping full name"
            required
        />

        <label class="checkout__label" for="street">Street address</label>
        <input
            class="checkout__input"
            type="text"
            v-model="commerceStore.checkoutForm.shipping.street"
            name="street"
            placeholder="Enter your street address"
            required
        />

        <label class="checkout__label" for="city">City</label>
        <input
            class="checkout__input"
            type="text"
            v-model="commerceStore.checkoutForm.shipping.city"
            name="city"
            placeholder="Enter your city"
            required
        />

        <label class="checkout__label" for="postalZipCode"
            >Postal/Zip code</label
        >
        <input
            class="checkout__input"
            type="text"
            v-model="commerceStore.checkoutForm.shipping.postalZipCode"
            name="postalZipCode"
            placeholder="Enter your postal/zip code"
            required
        />

        <h4 class="checkout__subheading">Payment information</h4>

        <label class="checkout__label" for="cardNum">Credit card number</label>
        <input
            class="checkout__input"
            type="text"
            name="cardNum"
            v-model="commerceStore.checkoutForm.payment.cardNum"
            placeholder="Enter your card number"
        />

        <label class="checkout__label" for="expMonth">Expiry month</label>
        <input
            class="checkout__input"
            type="text"
            name="expMonth"
            v-model="commerceStore.checkoutForm.payment.expMonth"
            placeholder="Card expiry month"
        />

        <label class="checkout__label" for="expYear">Expiry year</label>
        <input
            class="checkout__input"
            type="text"
            name="expYear"
            v-model="commerceStore.checkoutForm.payment.expYear"
            placeholder="Card expiry year"
        />

        <label class="checkout__label" for="ccv">CCV</label>
        <input
            class="checkout__input"
            type="text"
            name="ccv"
            v-model="commerceStore.checkoutForm.payment.ccv"
            placeholder="CCV (3 digits)"
        />

        <button class="checkout__btn-confirm" @click.prevent="confirmOrder">
            Confirm order
        </button>
    </form>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()
</script>
<style lang=""></style>
