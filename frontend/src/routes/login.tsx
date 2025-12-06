import { createFileRoute, Link } from '@tanstack/react-router'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { useColorModeValue } from '../components/ui/color-mode'
import { LoginForm } from '../components/auth/LoginForm'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  return (
    <Container maxW="md" py={12}>
      <Box
        bg={bgColor}
        p={8}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        shadow="lg"
      >
        <VStack gap={6} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2}>Welcome Back</Heading>
            <Text color="gray.500">Sign in to your account</Text>
          </Box>

          <LoginForm />

          <Text textAlign="center" fontSize="sm" color="gray.500">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--chakra-colors-blue-500)', fontWeight: 600 }}>
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}
