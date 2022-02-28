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
    const checkoutForm = ref({
        customer: {
            firstName: '',
            lastName: '',
            email: '',
        },
        shipping: {
            name: '',
            street: '',
            city: '',
            stateProvince: '',
            postalZipCode: '',
            country: '',
        },
        fulfillment: {
            shippingOption: '',
        },
        payment: {
            cardNum: '',
            expMonth: '',
            expYear: '',
            ccv: '',
            billingPostalZipCode: '',
        },
    })
    const liveObject = ref({})
    const countries = ref([])
    const shippingSubdivisions = ref([])
    const shippingOptions = ref([])
    const fulfillment = ref([])

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
                checkoutForm.value.shipping.country
            )
            const shippingSubdivisionsData =
                await commerce.services.localeListShippingSubdivisions(
                    checkoutToken.value,
                    checkoutForm.value.shipping.country
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
                    country: checkoutForm.value.shipping.country,
                    region: checkoutForm.value.shipping.stateProvince,
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
                    shipping_option_id:
                        checkoutForm.value.fulfillment.shippingOption,
                    country: checkoutForm.value.shipping.country,
                    region: checkoutForm.value.shipping.stateProvince,
                }
            )
            console.log('Fulfillment:', fulfillmentData)
            fulfillment.value.shippingOption = fulfillmentData.id
            liveObject.value = fulfillmentData.live
        } catch (error) {
            console.log('There was an error setting the shipping option', error)
        }
    }
    const validateCheckoutForm = async () => {
        console.log('validateCheckoutForm', Object.values(checkoutForm.value))
    }
    const captureOrder = async () => {
        try {
            const order = await commerce.checkout.capture(
                checkoutToken.value.id,
                orderData.value
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
            const paypalAuthData = await commerce.checkout.capture(
                checkoutToken.value.id,
                orderData.value
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
                    // Handler if customer DOES authorize payment (this is where you get the payment_id & payer_id you need to pass to Chec)
                    captureOrder(data)
                },
                onCancel: function (data, actions) {
                    // Handler if customer does not authorize payment
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
    const orderData = computed(() =>
        checkoutToken.value
            ? {
                  line_items: checkoutToken.value.live.line_items,
                  customer: {
                      firstname: checkoutForm.value.customer.firstName,
                      lastname: checkoutForm.value.customer.lastName,
                      email: checkoutForm.value.customer.email,
                  },
                  shipping: {
                      name: checkoutForm.value.shipping.name,
                      street: checkoutForm.value.shipping.street,
                      town_city: checkoutForm.value.shipping.city,
                      county_state: checkoutForm.value.shipping.stateProvince,
                      postal_zip_code:
                          checkoutForm.value.shipping.postalZipCode,
                      country: checkoutForm.value.shipping.country,
                  },
                  fulfillment: {
                      shipping_method:
                          checkoutForm.value.fulfillment.shippingOption,
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
        } else if (paymentMethodCreditCard.value) {
            return {
                gateway: 'test_gateway',
                card: {
                    number: checkoutForm.value.payment.cardNum,
                    expiry_month: checkoutForm.value.payment.expMonth,
                    expiry_year: checkoutForm.value.payment.expYear,
                    cvc: checkoutForm.value.payment.ccv,
                    postal_zip_code:
                        checkoutForm.value.payment.billingPostalZipCode,
                },
            }
        }
    })
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
    watch([checkoutToken, checkoutForm], () => {
        if (checkoutToken.value) {
            if (checkoutForm.value.shipping.country) {
                fetchShippingSubdivisions()
            }
            if (
                checkoutForm.value.shipping.country !== '' &&
                checkoutForm.value.shipping.stateProvince !== ''
            ) {
                fetchShippingOptions()
            }
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
        validateShippingOption,
        validateCheckoutForm,
        captureOrder,
        paymentMethodCard,
        paymentMethodPaypal,
        totalPrice,
        cart,
        products,
        ready,
        error,
        checkoutToken,
        checkoutForm,
        liveObject,
        countries,
        shippingSubdivisions,
        shippingOptions,
        fulfillment,
        orderData,
    }
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCommerceStore, import.meta.hot))
