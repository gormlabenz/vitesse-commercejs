import Home from './views/Home.vue'
import ProductDetail from './views/ProductDetail.vue'

export const routes = [
    {
        path: '/',
        component: Home,
    },
    { path: '/product/:permalink', component: ProductDetail, props: true },
]
