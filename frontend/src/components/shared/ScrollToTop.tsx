import { type FC, useState, useEffect } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon } from "@chakra-ui/icons";
import { useColorModeValue } from "../ui/color-mode";

const ScrollToTop: FC = () => {
	// Colors
	const buttonBg = useColorModeValue("blue.500", "blue.300");
	const buttonHoverBg = useColorModeValue("blue.600", "blue.400");
	const buttonColor = useColorModeValue("white", "gray.900");

	// Scroll to top function
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	// Show/hide based on scroll position
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.pageYOffset > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);

		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	return (
		<Box
			position="fixed"
			bottom="32px"
			right="32px"
			zIndex="1000"
			opacity={isVisible ? 1 : 0}
			pointerEvents={isVisible ? "auto" : "none"}
			css={{
				animation: isVisible
					? "fadeInUp 0.3s ease-in-out"
					: "fadeOutDown 0.3s ease-in-out",
				"@keyframes fadeInUp": {
					from: {
						opacity: 0,
						transform: "translateY(20px)",
					},
					to: {
						opacity: 1,
						transform: "translateY(0)",
					},
				},
				"@keyframes fadeOutDown": {
					from: {
						opacity: 1,
						transform: "translateY(0)",
					},
					to: {
						opacity: 0,
						transform: "translateY(20px)",
					},
				},
			}}
		>
			<IconButton
				aria-label="Scroll to top"
				bg={buttonBg}
				color={buttonColor}
				_hover={{
					bg: buttonHoverBg,
					transform: "translateY(-2px)",
				}}
				_active={{
					transform: "translateY(0)",
				}}
				size="lg"
				borderRadius="full"
				shadow="lg"
				transition="all 0.3s ease"
				onClick={scrollToTop}
			>
				<ChevronUpIcon />
			</IconButton>
		</Box>
	);
};

export default ScrollToTop;
