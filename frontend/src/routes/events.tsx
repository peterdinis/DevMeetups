import { createFileRoute } from '@tanstack/react-router'
import EventsWrapper from '../components/events/EventsWrapper'

export const Route = createFileRoute('/events')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EventsWrapper />
}
