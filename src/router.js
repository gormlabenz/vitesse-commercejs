import Checkout from './views/Checkout.vue'
import Confirmation from './views/Confirmation.vue'
import Home from './views/Home.vue'
import ProductDetail from './views/ProductDetail.vue'

export const routes = [
    {
        path: '/',
        component: Home,
    },
    { path: '/product/:permalink', component: ProductDetail, props: true },
    { path: '/checkout', component: Checkout },
    { path: '/confirmation', component: Confirmation },
]
