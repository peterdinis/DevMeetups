"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import ScrollToTop from "../shared/ScrollToTop";

export function Provider(props: ColorModeProviderProps) {
	return (
		<ChakraProvider value={defaultSystem}>
			<ColorModeProvider {...props} />
			<ScrollToTop />
		</ChakraProvider>
	);
}
