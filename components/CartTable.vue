<template>
  <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400" style="min-width: 800px;">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="px-6 py-3">
            Product name
        </th>
        <th scope="col" class="px-6 py-3">
            Type
        </th>
        <th scope="col" class="px-6 py-3">
            Description
        </th>
        <th>
          Quantity / Action
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(basket, index) in basketDetails" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ basket.name }}
        </th>
        <td class="px-6 py-4">
            {{ basket.type }}
        </td>
        <td class="px-6 py-4" style="max-width: 250px">
            {{ basket.description }}
        </td>
        <td class="px-6 py-4" style="max-width: 120px">
          {{ basket.count }}
          <button @click="deleteItem(basket.id, user.id)" type="button" class="ml-3 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Remove</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const basketDetails = ref([])

onMounted(async () => {
  await getBasketDetails()
})

const getBasketDetails = async () => {
  try {
    let { data: basket, error } = await supabase
    .from('basket')
    .select(`
      id,
      user_id,
      products (
        id,
        name,
        type,
        description
      )
    `)
    .eq('user_id', user.value.id)
    //basketDetails.value = basket
    const products = basket.reduce((acc, curr) => {
      const product = curr.products;
      if (acc[product.id]) {
        acc[product.id].count++;
      } else {
        acc[product.id] = { ...product, count: 1 };
      }
      return acc;
    }, {});

  const result = Object.values(products);
  console.log(result)
  basketDetails.value = result
  } catch (error) {
    console.log(error)
  }
}

const deleteItem = async (productId, userId) => {
  const conf = confirm('Do you want to remove this from your basket?')

  if(conf) {
    try {
      const { data, error } = await supabase
      .from('basket')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', userId)
      //basketDetails.value = data
      getBasketDetails()
    } catch (error) {
      console.log(error)
    }
  }
}
</script>