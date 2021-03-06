import { useCommerceStore } from '../stores/commerce.js'
import { createPinia } from 'pinia'

// Setup Pinia
// https://pinia.esm.dev/
export const install = async ({ isClient, initialState, app, router }) => {
    const pinia = createPinia()
    app.use(pinia)
    // Refer to
    // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
    // for other serialization strategies.
    const store = useCommerceStore()

    if (import.meta.env.SSR) {
        await store.init()
        // initialState.pinia = store
        initialState.pinia = { products: store.products, cart: store.cart }
        initialState.pinia.ready = false
    } else {
        if (initialState.pinia) {
            store.$state = initialState.pinia
        }
    }

    router.beforeEach((to, from, next) => {
        if (!store.ready) {
            store.init()
        }
        next()
    })
}
