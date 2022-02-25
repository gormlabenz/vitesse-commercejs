import { useCommerceStore } from '../stores/commerce.js'
import { createPinia } from 'pinia'

// Setup Pinia
// https://pinia.esm.dev/
export const install = async ({ isClient, initialState, app }) => {
    const pinia = createPinia()
    app.use(pinia)
    // Refer to
    // https://github.com/antfu/vite-ssg/blob/main/README.md#state-serialization
    // for other serialization strategies.
    if (import.meta.env.SSR) {
        const store = useCommerceStore()
        await store.init()

        initialState.data = store
    } else {
        pinia.state.value = initialState.pinia
    }
}
