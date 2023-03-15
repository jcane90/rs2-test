<template>
  <Navbar @signout="signOut"/>
  <main>
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <h1 class="text-2xl my-4">Products</h1>

      <div class="filters my-6 p-8 bg-white rounded-lg shadow-lg ring-gray-900/5">
        <div id="listbox-label" class="block text-sm font-medium leading-6 text-gray-900 mb-4">Filters:</div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
            <input v-model="filterName" type="text" placeholder="Search product name..." class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" name="" id="">
          </div>
          <div>
            <label class="block text-sm font-medium leading-6 text-gray-900">Type</label>
            <select v-model="filterType" class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <option value="all">All</option>
              <option value="Books">Books</option>
              <option value="Music">Music</option>
              <option value="Games">Games</option>
            </select>
          </div>
          <div>
            <button @click="filterProducts(filterName, filterType)" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            <button @click="filterName = '', filterType = 'all', filterProducts(filterName, filterType)" type="button" class="focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2">Clear filters</button>
          </div>
        </div>
      </div>
      
      <div class="relative overflow-x-auto">
        <Loading v-if="isLoading" />
        <table v-if="countProducts > 0" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
            <tr v-for="(product, index) in allProducts" :key="product.uuid" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ product.name }}
              </th>
              <td class="px-6 py-4">
                  {{ product.type }}
              </td>
              <td class="px-6 py-4" style="max-width: 250px">
                  {{ product.description }}
              </td>
              <td class="px-6 py-4" style="max-width: 120px">
                <input v-model="quantity[index]" class="relative cursor-default mr-2 rounded-md bg-white py-1.5 px-3 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6" type="number" min="1" max="5">
                <button @click="addToBasket(product.id, quantity[index], user.id)" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="countProducts === 0 && !isLoading" class="text-center my-4">
          <em>No products found.</em>
        </div>
      </div>

      <div class="pt-8 pb-28 border-t border-slate-200 text-slate-500 dark:border-slate-200/5 mt-12">
        <h1 class="text-2xl my-4">Your Basket</h1>
        <cart-table />
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()
const allProducts = ref()
const filterName = ref('')
const filterType = ref('all')
const isLoading = ref(false)
const countProducts = ref(0)
const quantity = ref([])
const cart = ref([])

definePageMeta({
  middleware: 'auth'
})

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    router.push({ path: "/auth" });
  } catch (error) {
    
  }
}

onMounted(async () => {
  await getProducts()
})

const getProducts = async () => {
  isLoading.value = true
  allProducts.value = null
  countProducts.value = 0
  try {
    let { data: products, errorata } = await supabase
    .from('products')
    .select('*')
    allProducts.value = products
    countProducts.value = allProducts.value.length
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = true
  }
}

const filterProducts = async (filterName, filterType) => {
  isLoading.value = true
  allProducts.value = null
  countProducts.value = 0
  const name = filterName

  let type = []
  if( filterType === 'all' ) {
    type = ['Games', 'Music', 'Books']
  } else {
    type = [filterType]
  }

  try {
    let { data: products, error } = await supabase
    .from('products')
    .select("*")
    .ilike('name', `%${name}%`)
    .in('type', type)
    allProducts.value = products
    countProducts.value = allProducts.value.length
    isLoading.value = false
  } catch (error) {
    console.log(error)
    isLoading.value = false
  }
}

const addToBasket = async (productId, quantity, userId) => {
  try {
    for (let i = 0; i < quantity; i++) {
      const { data, error } = await supabase
      .from('basket')
      .insert([
        { ProductID: productId, UserID: userId },
      ])
      debugger
      console.log(quantity)
    }
  } catch (error) {
    console.log(error)
  }
}
</script>
