<template>
    <div>Products in Cart:{{ useCommerceStore().cart.data }}</div>
</template>
<script>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()
</script>
