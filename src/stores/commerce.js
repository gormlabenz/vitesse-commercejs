import Commerce from '@chec/commerce.js'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useRouter } from 'vue-router'

const commerce = new Commerce(
    import.meta.env.VITE_COMMERCEJS_PUBLIC_KEY,
    import.meta.PROD
)

export const useCommerceStore = defineStore('commerceStore', () => {
    const ready = ref(false)
    const cart = ref({})
    const products = ref([])
    const error = ref(null)
    const checkoutToken = ref(null)
    const stage = ref(0)
    const customer = ref({
        firstName: '',
        lastName: '',
        email: '',
    })
    const shipping = ref({
        name: '',
        street: '',
        city: '',
        postalZipCode: '',
        country: '',
    })
    const fulfillment = ref({
        shippingOption: '',
    })
    const payment = ref({
        cardNum: '',
        expMonth: '',
        expYear: '',
        ccv: '',
        billingPostalZipCode: '',
    })
    const liveObject = ref({})
    const countries = ref([])
    const shippingSubdivisions = ref([])
    const shippingOptions = ref([])

    const paymentMethodPaypal = ref(true)
    const paymentMethodCard = ref(false)

    const paypalAuth = ref({})

    const init = async () => {
        try {
            const productsResponse = commerce.products.list()
            const cartResponse = commerce.cart.retrieve()

            const [productsData, cartData] = await Promise.all([
                productsResponse,
                cartResponse,
            ])

            products.value = productsData.data
            cart.value = cartData
        } catch (error) {
            error.value = error
            error.value = error
        } finally {
            ready.value = true
        }
    }
    const addToCart = async (product) => {
        commerce.cart
            .add(product.id, 1)
            .then((resp) => {
                cart.value = resp.cart
            })
            .catch((error) => {
                error.value = error
            })
    }
    const removeFromCart = async (product) => {
        commerce.cart
            .remove(product.id)
            .then((resp) => {
                cart.value = resp.cart
            })
            .catch((error) => {
                error.value = error
            })
    }
    const refreshCart = async () => {
        await commerce.refreshCart()
        commit('refreshCart')
    }
    const generateCheckoutToken = async () => {
        try {
            const checkoutTokenData = await commerce.checkout.generateToken(
                cart.value.id,
                { type: 'cart' }
            )
            checkoutToken.value = checkoutTokenData
            console.log('checkoutToken', checkoutTokenData)
        } catch (error) {
            error.value = error
        }
    }
    const getLiveObject = async () => {
        try {
            const liveObjectData = await commerce.checkout.getLive(
                checkoutToken.value
            )
            liveObject.value = liveObjectData
        } catch (error) {
            console.error(error)
            error.value = error
        }
    }
    const fetchShippingCountries = async () => {
        try {
            const countriesData =
                await commerce.services.localeListShippingCountries(
                    checkoutToken.value
                )
            countries.value = countriesData.countries
        } catch (error) {
            console.log(
                'There was an error fetching a list of countries',
                error
            )
        }
    }
    const fetchShippingSubdivisions = async () => {
        try {
            console.log(
                'Fetching shipping subdivisions for country:',
                shipping.value.country
            )
            const shippingSubdivisionsData =
                await commerce.services.localeListShippingSubdivisions(
                    checkoutToken.value,
                    shipping.value.country
                )
            console.log(shippingSubdivisions)
            shippingSubdivisions.value = shippingSubdivisionsData.subdivisions
        } catch (error) {
            console.log(
                'There was an error fetching a list of shipping subdivisions',
                error
            )
        }
    }
    const fetchShippingOptions = async () => {
        try {
            const optionsData = await commerce.checkout.getShippingOptions(
                checkoutToken.value.id,
                {
                    country: shipping.value.country,
                }
            )
            console.log('Shipping options:', optionsData)
            shippingOptions.value = optionsData
        } catch (error) {
            console.log(
                'There was an error fetching the shipping methods',
                error
            )
        }
    }
    const validateShippingOption = async () => {
        try {
            const fulfillmentData = await commerce.checkout.checkShippingOption(
                checkoutToken.value,
                {
                    shipping_option_id: fulfillment.value.shippingOption,
                    country: shipping.value.country,
                }
            )
            console.log('Fulfillment:', fulfillmentData)
            fulfillment.valueOption = fulfillmentData.id
            liveObject.value = fulfillmentData.live
        } catch (error) {
            console.log('There was an error setting the shipping option', error)
        }
    }
    const captureOrder = async () => {
        try {
            const order = await commerce.checkout.capture(
                checkoutToken.value.id,
                orderDetails.value
            )
            order.value = order
            useRouter().push('/confirmation')
            console.log('Order captured', order)
        } catch (error) {
            console.log('There was an error confirming your order', error)
        }
    }
    const getPaypalPaymentId = async () => {
        try {
            // Use a checkout token ID that was generated earlier, and any order details that may have been collected
            // on this page.
            const orderDetailsData = {
                ...orderDetails.value,
                payment: {
                    gateway: 'paypal',
                    paypal: {
                        action: 'authorize',
                    },
                },
            }
            console.log('orderDetailsData', orderDetailsData)
            const paypalAuthData = await commerce.checkout.capture(
                checkoutToken.value.id,
                orderDetailsData
            )
            console.log('Paypal auth data:', paypalAuthData)
            paypalAuth.value = paypalAuthData
            // If we get here, we can now push the user to the PayPal URL.
            // An example of rendering the PayPal button is below
            renderPaypalButton()
            return
        } catch (response) {
            // There was an issue with capturing the order with Commerce.js
            console.log(response)
            alert(response.message)
            return
        } finally {
            // Any loading state can be removed here.
        }
    }
    const renderPaypalButton = async () => {
        paypal.Button.render(
            {
                env: 'sandbox', // Or 'production',
                commit: true, // Show a 'Pay Now' button
                payment: function () {
                    return paypalAuth.value.payment_id // The payment ID from earlier
                },
                onAuthorize: function (data, actions) {
                    console.log('onAuthorize', data, actions)
                    // Handler if customer DOES authorize payment (this is where you get the payment_id & payer_id you need to pass to Chec)
                    captureOrder(data)
                },
                onCancel: function (data, actions) {
                    // Handler if customer does not authorize payment
                    console.log('onCancel', data, actions)
                },
            },
            '#paypal-button-container'
        )
    }
    const totalPrice = computed(() =>
        ready.value
            ? cart.value.line_items.reduce((acc, item) => {
                  return acc + item.price.raw * item.quantity
              }, 0)
            : 0
    )
    const totalItems = computed(() =>
        ready.value ? cart.value.total_items : 0
    )
    const lineItems = computed(() => (ready.value ? cart.value.line_items : []))
    const orderDetails = computed(() =>
        checkoutToken.value
            ? {
                  line_items: checkoutToken.value.live.line_items,
                  customer: {
                      firstname: customer.value.firstName,
                      lastname: customer.value.lastName,
                      email: customer.value.email,
                  },
                  shipping: {
                      name: shipping.value.name,
                      street: shipping.value.street,
                      town_city: shipping.value.city,
                      postal_zip_code: shipping.value.postalZipCode,
                      country: shipping.value.country,
                  },
                  fulfillment: {
                      shipping_method: fulfillment.value.shippingOption,
                  },
                  payment: paymentData.value,
              }
            : {}
    )
    const paymentData = computed(() => {
        if (paymentMethodPaypal.value) {
            if (paypalAuth.value) {
                return {
                    gateway: 'paypal',
                    paypal: {
                        action: 'capture',
                        payment_id: paypalAuth.value.payment_id,
                        payer_id: paypalAuth.value.payer_id,
                    },
                }
            }
            return {
                gateway: 'paypal',
                paypal: {
                    action: 'authorize',
                },
            }
        } else if (paymentMethodCard.value) {
            return {
                gateway: 'test_gateway',
                card: {
                    number: payment.value.cardNum,
                    expiry_month: payment.value.expMonth,
                    expiry_year: payment.value.expYear,
                    cvc: payment.value.ccv,
                    postal_zip_code: payment.value.billingPostalZipCode,
                },
            }
        }
    })
    const validateForm = (form) => {
        if (form.checkValidity()) {
            if (stage.value == 0) {
                stage.value++
            } else if (stage.value == 1) {
                stage.value++
                getPaypalPaymentId()
            } else if (stage.value == 2) {
                captureOrder()
            }
        } else {
            const inputs = form.querySelectorAll('input')
            inputs.forEach((input) => {
                input.classList.add(
                    'invalid:border-red-500',
                    'invalid:border-2'
                )
            })
        }
    }
    watch(cart, () => {
        if (cart.value.line_items.length > 0) generateCheckoutToken()
    })
    watch(checkoutToken, () => {
        if (checkoutToken.value) {
            getLiveObject()
            fetchShippingCountries()
            //getPaypalPaymentId()
        }
    })
    watch([checkoutToken, shipping], () => {
        console.log(
            'checkoutToken, shipping',
            isRef(checkoutToken),
            isRef(shipping)
        )
        if (checkoutToken.value && shipping.value.country) {
            fetchShippingOptions()
        }
    })
    watch(paymentMethodCard, () => {
        if (paymentMethodCard.value) paymentMethodPaypal.value = false
    })
    watch(paymentMethodPaypal, () => {
        if (paymentMethodPaypal.value) paymentMethodCard.value = false
    })
    return {
        init,
        addToCart,
        removeFromCart,
        refreshCart,
        generateCheckoutToken,
        getLiveObject,
        fetchShippingCountries,
        fetchShippingSubdivisions,
        fetchShippingOptions,
        getPaypalPaymentId,
        validateShippingOption,
        captureOrder,
        validateForm,
        stage,
        customer,
        shipping,
        fulfillment,
        payment,
        paymentMethodCard,
        paymentMethodPaypal,
        totalPrice,
        totalItems,
        lineItems,
        cart,
        products,
        ready,
        error,
        checkoutToken,
        liveObject,
        countries,
        shippingSubdivisions,
        shippingOptions,
        orderDetails,
    }
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCommerceStore, import.meta.hot))
