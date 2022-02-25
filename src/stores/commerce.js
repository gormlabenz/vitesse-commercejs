import Commerce from '@chec/commerce.js'
import { acceptHMRUpdate, defineStore } from 'pinia'

const commerce = new Commerce(
    import.meta.env.VITE_COMMERCEJS_PUBLIC_KEY,
    import.meta.PROD
)

export const useCommerceStore = defineStore('commerceStore', () => {
    let ready = false

    const cart = reactive({
        data: null,
        isLoading: true,
        error: null,
    })

    const products = reactive({
        data: null,
        isLoading: true,
        error: null,
    })

    const init = async () => {
        try {
            const productsResponse = commerce.products.list()
            const cartResponse = commerce.cart.retrieve()

            const [productsData, cartData] = await Promise.all([
                productsResponse,
                cartResponse,
            ])

            products.data = productsData.data
            cart.data = cartData

            products.isLoading = false
            cart.isLoading = false
        } catch (error) {
            cart.error = error
            products.error = error
        } finally {
            cart.isLoading = false
            products.isLoading = false
            ready = true
        }
    }

    const addToCart = (product) => {
        commerce.cart
            .add(product.id, 1)
            .then((resp) => {
                cart.data = resp.cart
            })
            .catch((error) => {
                cart.error = error
            })
    }

    const removeFromCart = (product) => {
        commerce.cart
            .remove(product.id)
            .then((resp) => {
                cart.data = resp.cart
            })
            .catch((error) => {
                cart.error = error
            })
    }
    const refreshCart = () =>
        commerce.cart
            .refresh((c) => {
                cart.data = c
            })
            .catch((error) => {
                cart.error = error
            })

    function getProduct(id) {
        return products.data.find((p) => p.id === id)
    }

    const totalPrice = computed(() =>
        cart.data
            ? cart.data.line_items.reduce((acc, item) => {
                  return acc + item.price.raw * item.quantity
              }, 0)
            : 0
    )

    return {
        products,
        cart,
        totalPrice,
        init,
        addToCart,
        removeFromCart,
        refreshCart,
        getProduct,
    }
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCommerceStore, import.meta.hot))
