import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
	Box,
	Button,
	Input,
	Text,
	VStack,
	Heading,
	Field,
	IconButton,
	Container,
	Card,
	Flex,
	Link,
	HStack,
	Separator,
	Stack,
} from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import { LuEye, LuEyeOff, LuLock, LuMail, LuUser } from "react-icons/lu";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";

export function RegisterForm() {
	const { register: registerUser, isRegistering, error } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		defaultValues: {
			displayName: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			registerUser(value);
		},
	});

	return (
		<Container maxW="md" py={{ base: 12, md: 20 }}>
			<Card.Root
				bg="white"
				_dark={{ bg: "gray.800" }}
				borderWidth="1px"
				shadow="lg"
			>
				<Card.Body p={{ base: 6, md: 8 }}>
					<VStack gap={6} align="stretch">
						{/* Header */}
						<Box textAlign="center">
							<Box
								display="inline-block"
								p={3}
								bg="blue.500"
								color="white"
								borderRadius="lg"
								mb={4}
							>
								<LuUser size={24} />
							</Box>
							<Heading size="lg" fontWeight="bold" mb={2}>
								Create Account
							</Heading>
							<Text color="gray.600" _dark={{ color: "gray.400" }}>
								Sign up to get started
							</Text>
						</Box>

						{/* Error Message */}
						{error && (
							<Box
								p={4}
								bg="red.50"
								_dark={{ bg: "red.900/20" }}
								borderWidth="1px"
								borderColor="red.200"
								borderRadius="lg"
								fontSize="sm"
							>
								<Flex align="center" gap={2}>
									<Box w={2} h={2} bg="red.500" borderRadius="full" />
									<Text color="red.600" _dark={{ color: "red.400" }}>
										{error instanceof Error ? error.message : String(error)}
									</Text>
								</Flex>
							</Box>
						)}

						{/* Form */}
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
						>
							<Stack gap={5}>
								{/* Display Name Field */}
								<form.Field
									name="displayName"
									validators={{
										onChange: z
											.string()
											.min(2, "Display name must be at least 2 characters"),
									}}
								>
									{(field) => (
										<Field.Root invalid={field.state.meta.errors.length > 0}>
											<Field.Label fontSize="sm" fontWeight="medium">
												<Flex align="center" gap={2}>
													<LuUser
														size={16}
														color="var(--chakra-colors-blue-500)"
													/>
													Display Name
												</Flex>
											</Field.Label>
											<Input
												type="text"
												placeholder="Enter your display name"
												size="lg"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
											/>
											{field.state.meta.errors.length > 0 && (
												<Field.ErrorText>
													{field.state.meta.errors[0] as unknown as ReactNode}
												</Field.ErrorText>
											)}
										</Field.Root>
									)}
								</form.Field>

								{/* Email Field */}
								<form.Field
									name="email"
									validators={{
										onChange: z
											.string()
											.email("Please enter a valid email address"),
									}}
								>
									{(field) => (
										<Field.Root invalid={field.state.meta.errors.length > 0}>
											<Field.Label fontSize="sm" fontWeight="medium">
												<Flex align="center" gap={2}>
													<LuMail
														size={16}
														color="var(--chakra-colors-blue-500)"
													/>
													Email Address
												</Flex>
											</Field.Label>
											<Input
												type="email"
												placeholder="you@example.com"
												size="lg"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
											/>
											{field.state.meta.errors.length > 0 && (
												<Field.ErrorText>
													{field.state.meta.errors[0] as unknown as ReactNode}
												</Field.ErrorText>
											)}
										</Field.Root>
									)}
								</form.Field>

								{/* Password Field */}
								<form.Field
									name="password"
									validators={{
										onChange: z
											.string()
											.min(6, "Password must be at least 6 characters"),
									}}
								>
									{(field) => (
										<Field.Root invalid={field.state.meta.errors.length > 0}>
											<Field.Label fontSize="sm" fontWeight="medium">
												<Flex align="center" gap={2}>
													<LuLock
														size={16}
														color="var(--chakra-colors-blue-500)"
													/>
													Password
												</Flex>
											</Field.Label>
											<Box position="relative">
												<Input
													type={showPassword ? "text" : "password"}
													placeholder="Create a password"
													size="lg"
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													pr="3rem"
												/>
												<Box
													position="absolute"
													right={2}
													top="50%"
													transform="translateY(-50%)"
												>
													<IconButton
														aria-label={
															showPassword ? "Hide password" : "Show password"
														}
														onClick={() => setShowPassword(!showPassword)}
														variant="ghost"
														size="sm"
													>
														{showPassword ? <LuEyeOff /> : <LuEye />}
													</IconButton>
												</Box>
											</Box>
											{field.state.meta.errors.length > 0 && (
												<Field.ErrorText>
													{field.state.meta.errors[0] as unknown as ReactNode}
												</Field.ErrorText>
											)}
										</Field.Root>
									)}
								</form.Field>

								{/* Submit Button */}
								<Button
									type="submit"
									colorPalette="blue"
									size="lg"
									w="full"
									loading={isRegistering}
									disabled={!form.state.isValid || isRegistering}
								>
									Sign Up
								</Button>
							</Stack>
						</form>

						{/* Divider */}
						<Flex align="center" gap={4}>
							<Separator flex={1} />
							<Text
								fontSize="sm"
								color="gray.600"
								_dark={{ color: "gray.400" }}
							>
								Or sign up with
							</Text>
							<Separator flex={1} />
						</Flex>

						{/* Social Login */}
						<HStack gap={4}>
							<Button flex={1} variant="outline" size="lg">
								<FaGoogle />
								Google
							</Button>
							<Button flex={1} variant="outline" size="lg">
								<FaGithub />
								GitHub
							</Button>
						</HStack>

						{/* Sign In Link */}
						<Box textAlign="center">
							<Text
								fontSize="sm"
								color="gray.600"
								_dark={{ color: "gray.400" }}
							>
								Already have an account?{" "}
								<Link href="#" color="blue.500" fontWeight="medium">
									Sign in
								</Link>
							</Text>
						</Box>
					</VStack>
				</Card.Body>
			</Card.Root>
		</Container>
	);
}
