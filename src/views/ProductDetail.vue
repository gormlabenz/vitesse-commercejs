<template>
    <div>
        <h1>{{ 'helo' }}</h1>
    </div>
</template>
<script setup>
import { useCommerceStore } from '../stores/commerce'

const commerceStore = useCommerceStore()

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
})

const { id } = toRefs(props)

/* const product = computed(() =>
    commerceStore.products.data.find((product) => product.id === id.value)
) */
</script>
