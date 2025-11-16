import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { Button } from '@chakra-ui/react'

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button>TEST ME</Button>
    </div>
  )
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Index,
})