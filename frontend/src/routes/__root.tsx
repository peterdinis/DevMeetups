import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const RootLayout = () => (
  <>
    
    <Outlet />
    <TanStackRouterDevtools />
  </>
)

export const rootRoute = createRootRoute({
  component: RootLayout,
})