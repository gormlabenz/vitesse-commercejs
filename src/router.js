import Home from './views/Home.vue'
import ProductDetail from './views/ProductDetail.vue'

export const routes = [
    {
        path: '/',
        component: Home,
    },
    { path: '/product/:id', component: ProductDetail, props: true },
]
