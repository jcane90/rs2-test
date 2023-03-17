<template>
  <Navbar @signout="signOut"/>
  <main class="mt-16">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="pt-8 pb-28 border-t border-slate-200 text-slate-500 dark:border-slate-200/5 mt-12">
        <h1 class="text-2xl my-4">Cart</h1>
        <div class="overflow-x-auto">
          <cart-table />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
const supabase = useSupabaseClient()

definePageMeta({
  middleware: process.client ? 'auth' : undefined
})

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    router.push({ path: "/auth" });
  } catch (error) {
    
  }
}
</script>
