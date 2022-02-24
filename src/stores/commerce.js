import Commerce from '@chec/commerce.js'
import { acceptHMRUpdate, defineStore } from 'pinia'

export const useCommerceStore = defineStore('commerce', () => {
    const commerce = new Commerce(
        import.meta.env.VITE_COMMERCEJS_PUBLIC_KEY,
        import.meta.PROD
    )

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
            const productsResponse = await commerce.products.list()
            products.data = productsResponse.data
            const cartResponse = await commerce.cart.retrieve()
            cart.data = cartResponse
        } catch (error) {
            cart.error = error
            products.error = error
        } finally {
            cart.isLoading = false
            products.isLoading = false
        }
    }

    const addToCart = (product) =>
        commerce.cart
            .add(product.id, 1)
            .then((resp) => {
                cart.data = resp
            })
            .catch((error) => {
                cart.error = error
            })

    const removeFromCart = (product) =>
        commerce.cart
            .remove(product.id)
            .then((resp) => {
                cart.data = resp
            })
            .catch((error) => {
                cart.error = error
            })

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

    return {
        products,
        cart,
        init,
        addToCart,
        removeFromCart,
        refreshCart,
        getProduct,
    }
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCommerceStore, import.meta.hot))
