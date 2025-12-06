import { createRouter } from '@tanstack/react-router'
import { indexRoute } from '../routes'
import { rootRoute } from '../routes/__root'
import { eventsRoute } from '../routes/events'
import { loginRoute } from '../routes/login'
import { registerRoute } from '../routes/register'
import { profileRoute } from '../routes/profile'

const routeTree = rootRoute.addChildren([
  indexRoute,
  eventsRoute,
  loginRoute,
  registerRoute,
  profileRoute
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}