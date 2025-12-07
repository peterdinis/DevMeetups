import type { FC } from "react";
import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Text,
	VStack,
	Card,
	Separator,
	HStack,
	Badge,
	Stack,
} from "@chakra-ui/react";
import {
	LuMail,
	LuUser,
	LuShield,
	LuLogOut,
	LuSettings,
	LuBell,
	LuLock,
} from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";

const ProfileWrapper: FC = () => {
	const { user, logout, isLoggingOut, isLoading } = useAuth();

	if (isLoading) {
		return (
			<Container py={12} textAlign="center">
				<Box
					display="inline-block"
					p={4}
					bg="blue.50"
					_dark={{ bg: "blue.900/20" }}
					borderRadius="lg"
				>
					<Text color="blue.600" _dark={{ color: "blue.400" }}>
						Loading profile...
					</Text>
				</Box>
			</Container>
		);
	}

	if (!user) {
		return (
			<Container maxW="md" py={12}>
				<Card.Root
					bg="white"
					_dark={{ bg: "gray.800" }}
					borderWidth="1px"
					shadow="lg"
				>
					<Card.Body p={8} textAlign="center">
						<Box
							display="inline-block"
							p={4}
							bg="gray.100"
							_dark={{ bg: "gray.700" }}
							borderRadius="full"
							mb={4}
						>
							<LuUser size={32} />
						</Box>
						<Heading size="lg" mb={2}>
							Not Signed In
						</Heading>
						<Text color="gray.600" _dark={{ color: "gray.400" }} mb={6}>
							Please log in to view your profile.
						</Text>
						<Button colorPalette="blue" size="lg">
							Sign In
						</Button>
					</Card.Body>
				</Card.Root>
			</Container>
		);
	}

	return (
		<Container maxW="4xl" py={{ base: 8, md: 12 }}>
			<VStack gap={6} align="stretch">
				{/* Profile Header Card */}
				<Card.Root
					bg="white"
					_dark={{ bg: "gray.800" }}
					borderWidth="1px"
					shadow="lg"
				>
					<Card.Body p={{ base: 6, md: 8 }}>
						<Flex
							direction={{ base: "column", md: "row" }}
							align={{ base: "center", md: "start" }}
							gap={6}
						>
							{/* Avatar */}
							<Box
								w={24}
								h={24}
								bg="blue.500"
								borderRadius="full"
								display="flex"
								alignItems="center"
								justifyContent="center"
								color="white"
								fontSize="3xl"
								fontWeight="bold"
								border="4px"
								borderColor="blue.100"
								_dark={{ borderColor: "blue.900" }}
								flexShrink={0}
							>
								{user.displayName?.substring(0, 2).toUpperCase() || "UN"}
							</Box>

							{/* User Info */}
							<Box flex="1" textAlign={{ base: "center", md: "left" }}>
								<Heading size="xl" mb={2}>
									{user.displayName || "Unknown User"}
								</Heading>
								<Flex
									align="center"
									gap={2}
									justify={{ base: "center", md: "flex-start" }}
									mb={2}
								>
									<LuMail size={16} />
									<Text color="gray.600" _dark={{ color: "gray.400" }}>
										{user.email}
									</Text>
								</Flex>
								<HStack gap={2} justify={{ base: "center", md: "flex-start" }}>
									<Badge colorPalette="green" size="sm">
										Active
									</Badge>
									<Badge colorPalette="blue" size="sm">
										Verified
									</Badge>
								</HStack>
							</Box>

							{/* Actions */}
							<VStack gap={2} alignSelf={{ base: "stretch", md: "start" }}>
								<Button
									variant="outline"
									size="md"
									w={{ base: "full", md: "auto" }}
								>
									<LuSettings />
									Settings
								</Button>
								<Button
									colorPalette="red"
									variant="outline"
									size="md"
									onClick={() => logout()}
									loading={isLoggingOut}
									w={{ base: "full", md: "auto" }}
								>
									<LuLogOut />
									Sign Out
								</Button>
							</VStack>
						</Flex>
					</Card.Body>
				</Card.Root>

				{/* Account Details Card */}
				<Card.Root
					bg="white"
					_dark={{ bg: "gray.800" }}
					borderWidth="1px"
					shadow="lg"
				>
					<Card.Body p={{ base: 6, md: 8 }}>
						<Heading size="lg" mb={6}>
							<Flex align="center" gap={2}>
								<LuUser size={24} />
								Account Details
							</Flex>
						</Heading>

						<Stack gap={4}>
							<Box>
								<Flex align="center" gap={2} mb={2}>
									<LuUser size={16} color="var(--chakra-colors-blue-500)" />
									<Text fontWeight="medium" color="gray.500" fontSize="sm">
										Display Name
									</Text>
								</Flex>
								<Text fontSize="lg" pl={6}>
									{user.displayName || "Not set"}
								</Text>
							</Box>

							<Separator />

							<Box>
								<Flex align="center" gap={2} mb={2}>
									<LuMail size={16} color="var(--chakra-colors-blue-500)" />
									<Text fontWeight="medium" color="gray.500" fontSize="sm">
										Email Address
									</Text>
								</Flex>
								<Text fontSize="lg" pl={6}>
									{user.email}
								</Text>
							</Box>

							<Separator />

							<Box>
								<Flex align="center" gap={2} mb={2}>
									<LuShield size={16} color="var(--chakra-colors-blue-500)" />
									<Text fontWeight="medium" color="gray.500" fontSize="sm">
										User ID
									</Text>
								</Flex>
								<Text
									fontSize="sm"
									fontFamily="mono"
									pl={6}
									color="gray.600"
									_dark={{ color: "gray.400" }}
								>
									{user.id}
								</Text>
							</Box>
						</Stack>
					</Card.Body>
				</Card.Root>

				{/* Quick Actions Card */}
				<Card.Root
					bg="white"
					_dark={{ bg: "gray.800" }}
					borderWidth="1px"
					shadow="lg"
				>
					<Card.Body p={{ base: 6, md: 8 }}>
						<Heading size="lg" mb={6}>
							Quick Actions
						</Heading>

						<Stack gap={3}>
							<Button
								variant="outline"
								size="lg"
								justifyContent="flex-start"
								w="full"
							>
								<Flex align="center" gap={3} flex={1}>
									<Box
										p={2}
										bg="blue.50"
										_dark={{ bg: "blue.900/20" }}
										borderRadius="md"
									>
										<LuLock size={20} color="var(--chakra-colors-blue-500)" />
									</Box>
									<Box textAlign="left">
										<Text fontWeight="medium">Change Password</Text>
										<Text fontSize="sm" color="gray.500">
											Update your password to keep your account secure
										</Text>
									</Box>
								</Flex>
							</Button>

							<Button
								variant="outline"
								size="lg"
								justifyContent="flex-start"
								w="full"
							>
								<Flex align="center" gap={3} flex={1}>
									<Box
										p={2}
										bg="purple.50"
										_dark={{ bg: "purple.900/20" }}
										borderRadius="md"
									>
										<LuBell size={20} color="var(--chakra-colors-purple-500)" />
									</Box>
									<Box textAlign="left">
										<Text fontWeight="medium">Notification Settings</Text>
										<Text fontSize="sm" color="gray.500">
											Manage your email and push notifications
										</Text>
									</Box>
								</Flex>
							</Button>

							<Button
								variant="outline"
								size="lg"
								justifyContent="flex-start"
								w="full"
							>
								<Flex align="center" gap={3} flex={1}>
									<Box
										p={2}
										bg="green.50"
										_dark={{ bg: "green.900/20" }}
										borderRadius="md"
									>
										<LuShield
											size={20}
											color="var(--chakra-colors-green-500)"
										/>
									</Box>
									<Box textAlign="left">
										<Text fontWeight="medium">Security Settings</Text>
										<Text fontSize="sm" color="gray.500">
											Two-factor authentication and security preferences
										</Text>
									</Box>
								</Flex>
							</Button>
						</Stack>
					</Card.Body>
				</Card.Root>
			</VStack>
		</Container>
	);
};

export default ProfileWrapper;
