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
        fulfillment: [],
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
        async validateShippingOption(shippingOptionId) {
            try {
                const fulfillment = await commerce.checkout.checkShippingOption(
                    this.checkoutToken,
                    {
                        shipping_option_id: shippingOptionId,
                        country: this.checkoutForm.shipping.country,
                        region: this.checkoutForm.shipping.stateProvince,
                    }
                )
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
