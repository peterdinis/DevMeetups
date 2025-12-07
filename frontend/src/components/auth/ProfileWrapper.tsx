import type { FC } from "react";
import {
	Box,
	Button,
	Container,
	Flex,
	Heading,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useColorModeValue } from "../ui/color-mode";

const ProfileWrapper: FC = () => {
	const { user, logout, isLoggingOut, isLoading } = useAuth();
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");

	if (isLoading) {
		return (
			<Container py={12} textAlign="center">
				<Text>Loading profile...</Text>
			</Container>
		);
	}

	if (!user) {
		// Fallback if not redirected yet (though useAuth or router should handle it)
		return (
			<Container py={12} textAlign="center">
				<Text>Please log in to view your profile.</Text>
			</Container>
		);
	}

	return (
		<Container maxW="container.md" py={12}>
			<Box
				bg={bgColor}
				p={8}
				borderRadius="xl"
				border="1px"
				borderColor={borderColor}
				shadow="lg"
			>
				<VStack gap={6} align="start">
					<Flex
						align="center"
						gap={6}
						w="full"
						direction={{ base: "column", sm: "row" }}
					>
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
						>
							{user.displayName?.substring(0, 2).toUpperCase() || "UN"}
						</Box>

						<Box flex="1" textAlign={{ base: "center", sm: "left" }}>
							<Heading size="xl" mb={1}>
								{user.displayName}
							</Heading>
							<Text color="gray.500" fontSize="lg">
								{user.email}
							</Text>
							<Text color="gray.400" fontSize="sm" mt={1}>
								ID: {user.id}
							</Text>
						</Box>

						<Button
							colorScheme="red"
							variant="outline"
							onClick={() => logout()}
							loading={isLoggingOut}
						>
							Sign Out
						</Button>
					</Flex>

					<Box w="full" pt={6} borderTop="1px" borderColor={borderColor}>
						<Heading size="md" mb={4}>
							Account Details
						</Heading>
						<VStack align="start" gap={3}>
							<Box>
								<Text fontWeight="medium" color="gray.500" fontSize="sm">
									Display Name
								</Text>
								<Text>{user.displayName}</Text>
							</Box>
							<Box>
								<Text fontWeight="medium" color="gray.500" fontSize="sm">
									Email Address
								</Text>
								<Text>{user.email}</Text>
							</Box>
						</VStack>
					</Box>
				</VStack>
			</Box>
		</Container>
	);
};

export default ProfileWrapper;
