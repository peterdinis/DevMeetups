import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './__root'
import { RegisterForm } from '../components/auth/RegisterForm'

function Register() {
  return (
    <>
      <RegisterForm />
    </>
  )
}

export const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
})