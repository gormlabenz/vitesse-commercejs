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

    commerce.cart
        .retrieve()
        .then((resp) => {
            cart.data = resp
            cart.isLoading = false
        })
        .catch((error) => {
            cart.error = error
        })

    commerce.products
        .list()
        .then((resp) => {
            products.data = resp.data
            products.isLoading = false
        })
        .catch((error) => {
            products.error = error
        })

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

    return {
        products,
        cart,
        addToCart,
        removeFromCart,
        refreshCart,
    }
})

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useCommerceStore, import.meta.hot))
