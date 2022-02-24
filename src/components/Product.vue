<template>
    <a :href="'product/' + product.permalink" class="w-64 text-left">
        <h3 class="text-xl font-bold">{{ product.name }}</h3>
        <p v-html="product.description"></p>
    </a>
</template>
<script setup>
const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
})

const { product } = toRefs(props)

const router = useRouter()

function push() {
    router.push({ path: '/product', params: { id: product.value.id } })
}
</script>
<style lang=""></style>
