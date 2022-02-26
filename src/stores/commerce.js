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
                const token = await commerce.checkout.generateToken(
                    this.cart.id,
                    { type: 'cart' }
                )
                console.log(token)
                return token
            } catch (error) {
                this.error = error
            }
        },
        async checkout() {
            try {
                const checkoutToken = await this.generateCheckoutToken()
                const checkoutResponse = await commerce.checkout(checkoutToken)
                console.log(checkoutToken, checkoutResponse)
                return checkoutResponse
            } catch (error) {
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
