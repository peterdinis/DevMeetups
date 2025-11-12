import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// Root layout component
export const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
)

// Root route
export const rootRoute = createRootRoute({
  component: RootLayout,
})
