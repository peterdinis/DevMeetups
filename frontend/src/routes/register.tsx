import { createFileRoute, Link } from '@tanstack/react-router'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { useColorModeValue } from '../components/ui/color-mode'
import { RegisterForm } from '../components/auth/RegisterForm'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
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
            <Heading size="xl" mb={2}>Create Account</Heading>
            <Text color="gray.500">Join the community today</Text>
          </Box>

          <RegisterForm />

          <Text textAlign="center" fontSize="sm" color="gray.500">
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--chakra-colors-blue-500)', fontWeight: 600 }}>
              Sign in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  )
}
