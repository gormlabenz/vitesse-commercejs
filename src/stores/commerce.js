import Commerce from '@chec/commerce.js'
import { acceptHMRUpdate, defineStore } from 'pinia'

const commerce = new Commerce(
    import.meta.env.VITE_COMMERCEJS_PUBLIC_KEY,
    import.meta.PROD
)

export const useCommerceStore = defineStore('commerceStore', {
    state: () => ({
        cart: {},
        products: [],
        ready: false,
        error: null,
        checkoutToken: null,
        checkoutForm: {
            customer: {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'janedoe@email.com',
            },
            shipping: {
                name: 'Jane Doe',
                street: '123 Fake St',
                city: 'San Francisco',
                stateProvince: 'CA',
                postalZipCode: '94107',
                country: 'US',
            },
            fulfillment: {
                shippingOption: '',
            },
            payment: {
                cardNum: '4242 4242 4242 4242',
                expMonth: '01',
                expYear: '2023',
                ccv: '123',
                billingPostalZipCode: '94107',
            },
        },
        liveObject: {},
        countries: [],
        shippingSubdivisions: [],
        shippingOptions: [],
        fulfillment: [],
        orderData: {},
    }),
    actions: {
        async init() {
            try {
                const productsResponse = commerce.products.list()
                const cartResponse = commerce.cart.retrieve()

                const [productsData, cartData] = await Promise.all([
                    productsResponse,
                    cartResponse,
                ])

                this.products = productsData.data
                this.cart = cartData
            } catch (error) {
                this.error = error
                this.error = error
            } finally {
                this.ready = true
            }
        },
        async addToCart(product) {
            commerce.cart
                .add(product.id, 1)
                .then((resp) => {
                    this.cart = resp.cart
                })
                .catch((error) => {
                    this.error = error
                })
        },
        async removeFromCart(product) {
            commerce.cart
                .remove(product.id)
                .then((resp) => {
                    this.cart = resp.cart
                })
                .catch((error) => {
                    this.error = error
                })
        },
        async refreshCart() {
            await commerce.refreshCart()
            commit('refreshCart')
        },
        async generateCheckoutToken() {
            try {
                const checkoutToken = await commerce.checkout.generateToken(
                    this.cart.id,
                    { type: 'cart' }
                )
                this.checkoutToken = checkoutToken
            } catch (error) {
                this.error = error
            }
        },
        async getLiveObject() {
            try {
                const liveObject = await commerce.checkout.getLive(
                    this.checkoutToken
                )
                this.liveObject = liveObject
            } catch (error) {
                console.error(error)
                this.error = error
            }
        },
        async fetchShippingCountries() {
            try {
                const countries =
                    await commerce.services.localeListShippingCountries(
                        this.checkoutToken
                    )
                this.countries = countries.countries
            } catch (error) {
                console.log(
                    'There was an error fetching a list of countries',
                    error
                )
            }
        },
        async fetchShippingSubdivisions() {
            try {
                console.log(
                    'Fetching shipping subdivisions for country:',
                    this.checkoutForm.shipping.country
                )
                const shippingSubdivisions =
                    await commerce.services.localeListShippingSubdivisions(
                        this.checkoutToken,
                        this.checkoutForm.shipping.country
                    )
                console.log(shippingSubdivisions)
                this.shippingSubdivisions = shippingSubdivisions.subdivisions
            } catch (error) {
                console.log(
                    'There was an error fetching a list of shipping subdivisions',
                    error
                )
            }
        },
        async fetchShippingOptions() {
            try {
                const options = await commerce.checkout.getShippingOptions(
                    this.checkoutToken.id,
                    {
                        country: this.checkoutForm.shipping.country,
                        region: this.checkoutForm.shipping.stateProvince,
                    }
                )
                console.log('Shipping options:', options)
                this.shippingOptions = options
            } catch (error) {
                console.log(
                    'There was an error fetching the shipping methods',
                    error
                )
            }
        },
        async validateShippingOption() {
            try {
                const fulfillment = await commerce.checkout.checkShippingOption(
                    this.checkoutToken,
                    {
                        shipping_option_id:
                            this.checkoutForm.fulfillment.shippingOption,
                        country: this.checkoutForm.shipping.country,
                        region: this.checkoutForm.shipping.stateProvince,
                    }
                )
                console.log('Fulfillment:', fulfillment)
                this.fulfillment.shippingOption = fulfillment.id
                this.liveObject = fulfillment.live
            } catch (error) {
                console.log(
                    'There was an error setting the shipping option',
                    error
                )
            }
        },
        async checkout() {
            try {
                await this.generateCheckoutToken()
                console.log('Checkout token generated', this.checkoutToken)
                await this.getLiveObject()
                console.log('Live object generated', this.liveObject)
                await this.fetchShippingCountries()
                console.log('Shipping countries fetched', this.countries)
                await this.fetchShippingSubdivisions(
                    this.checkoutForm.shipping.country
                )
                console.log(
                    'Shipping subdivisions fetched',
                    this.shippingSubdivisions
                )
            } catch (error) {
                console.error(error)
                this.error = error
            }
        },
        async confirmOrder() {
            this.orderData = {
                line_items: this.checkoutToken.live.line_items,
                customer: {
                    firstname: this.checkoutForm.customer.firstName,
                    lastname: this.checkoutForm.customer.lastName,
                    email: this.checkoutForm.customer.email,
                },
                shipping: {
                    name: this.checkoutForm.shipping.name,
                    street: this.checkoutForm.shipping.street,
                    town_city: this.checkoutForm.shipping.city,
                    county_state: this.checkoutForm.shipping.stateProvince,
                    postal_zip_code: this.checkoutForm.shipping.postalZipCode,
                    country: this.checkoutForm.shipping.country,
                },
                fulfillment: {
                    shipping_method:
                        this.checkoutForm.fulfillment.shippingOption,
                },
                payment: {
                    gateway: 'test_gateway',
                    card: {
                        number: this.checkoutForm.payment.cardNum,
                        expiry_month: this.checkoutForm.payment.expMonth,
                        expiry_year: this.checkoutForm.payment.expYear,
                        cvc: this.checkoutForm.payment.ccv,
                        postal_zip_code:
                            this.checkoutForm.payment.billingPostalZipCode,
                    },
                },
            }
        },
        async handleConfirmOrder() {
            await this.confirmOrder()
            try {
                const order = await commerce.checkout.capture(
                    this.checkoutToken.id,
                    this.orderData
                )
                this.order = order
                console.log('Order captured', order)
            } catch (error) {
                console.log('There was an error confirming your order', error)
            }
        },
    },
    getters: {
        totalPrice: (state) =>
            state.ready
                ? state.cart.line_items.reduce((acc, item) => {
                      return acc + item.price.raw * item.quantity
                  }, 0)
                : 0,
    },
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCommerceStore, import.meta.hot))
