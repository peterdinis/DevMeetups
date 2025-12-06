import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import ProfileWrapper from '../components/auth/ProfileWrapper'

function Profile() {
  return (
    <>
      <ProfileWrapper />
    </>
  )
}

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: Profile,
})