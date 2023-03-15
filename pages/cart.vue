<template>
  <Navbar @signout="signOut"/>
</template>

<script setup>
import { ref } from 'vue'
const supabase = useSupabaseClient()

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
</script>
