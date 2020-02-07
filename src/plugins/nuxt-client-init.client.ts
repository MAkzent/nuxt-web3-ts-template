export default async ({ route, store }) => {
  await store.dispatch('nuxtClientInit', route)
}
