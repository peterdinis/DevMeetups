import { createRoute } from '@tanstack/react-router'
import EventsWrapper from '../components/events/EventsWrapper'
import { rootRoute } from './__root'

export const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  component: RouteComponent
})

function RouteComponent() {
  return <EventsWrapper />
}
