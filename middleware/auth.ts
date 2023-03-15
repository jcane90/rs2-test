export default defineNuxtRouteMiddleware((to, _from) => {
  console.log(_from, to)
  const user = useSupabaseUser()
  if (_from.path === '/auth') return 
  if (!user.value) {
    return navigateTo('/auth')
  }
})
