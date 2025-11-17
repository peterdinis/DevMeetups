import { createRouter } from '@tanstack/react-router'
import { indexRoute } from '../routes'
import { rootRoute } from '../routes/__root'
import { eventsRoute } from '../routes/events'

const routeTree = rootRoute.addChildren([indexRoute, eventsRoute])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}