<template>
  <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
        </p>
      </div>
      <form @submit.prevent="login" class="mt-8 space-y-6" action="#" method="POST">
        <input type="hidden" name="remember" value="true" />
        <div class="-space-y-px rounded-md shadow-sm">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input v-model="username" id="username" name="username" type="email" autocomplete="username" required="" class="relative block w-full rounded-t-md border-0 px-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Email address" />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input  v-model="password" id="password" name="password" type="password" autocomplete="current-password" required="" class="relative block w-full rounded-b-md border-0 px-2 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Password" />
          </div>
        </div>

        <div>
          <button :disabled="isLoading" type="submit" :class="isLoading ? 'bg-gray-300': 'bg-indigo-600' " class="group relative flex w-full justify-center rounded-md py-2 px-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            {{ isLoading ? 'Loading...' : 'Sign in' }}
          </button>
        </div>
        <div v-if="invalidUser" class="text-center text-red-600">Invalid User!</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onUpdated } from 'vue';
const router = useRouter()
const supabase = useSupabaseClient()

const  username = ref('')
const password = ref('')

const isLoading = ref(false)
const invalidUser = ref(false)

definePageMeta({
  middleware: process.client ? 'notauth' : undefined
})


const login = async () => {
  try {
    //console.log(router)
    isLoading.value = true
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: username.value,
      password: password.value 
    })
    invalidUser.value = !data.user ? true : false
    if(data.user) {
      router.push({ path: "/" });
    }else {
      invalidUser.value = true
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    invalidUser.value = true
    console.log(error)
  }
}
</script>
