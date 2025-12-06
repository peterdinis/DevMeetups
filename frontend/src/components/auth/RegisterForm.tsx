import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react'
import { useAuth } from '../../hooks/useAuth'

const registerSchema = z.object({
    displayName: z.string().min(2, 'Display name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
    const { register: registerUser, isRegistering, error } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = (data: RegisterFormData) => {
        registerUser(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <VStack gap={4} align="stretch">
                {error && (
                    <Box p={3} bg="red.50" color="red.500" borderRadius="md" fontSize="sm">
                        {(error as Error).message}
                    </Box>
                )}

                <Box>
                    <Text mb={1} fontSize="sm" fontWeight="medium">Display Name</Text>
                    <Input
                        type="text"
                        placeholder="Enter your display name"
                        {...register('displayName')}
                    />
                    {errors.displayName && (
                        <Text color="red.500" fontSize="xs" mt={1}>{errors.displayName.message}</Text>
                    )}
                </Box>

                <Box>
                    <Text mb={1} fontSize="sm" fontWeight="medium">Email</Text>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        {...register('email')}
                    />
                    {errors.email && (
                        <Text color="red.500" fontSize="xs" mt={1}>{errors.email.message}</Text>
                    )}
                </Box>

                <Box>
                    <Text mb={1} fontSize="sm" fontWeight="medium">Password</Text>
                    <Input
                        type="password"
                        placeholder="Create a password"
                        {...register('password')}
                    />
                    {errors.password && (
                        <Text color="red.500" fontSize="xs" mt={1}>{errors.password.message}</Text>
                    )}
                </Box>

                <Button
                    type="submit"
                    colorScheme="blue"
                    w="full"
                    loading={isRegistering}
                    mt={2}
                >
                    Sign Up
                </Button>
            </VStack>
        </form>
    )
}
