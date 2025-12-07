import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navigation from "../components/shared/Navigation";

export const RootLayout = () => (
	<>
		<Navigation />
		<Outlet />
		<TanStackRouterDevtools />
	</>
);

export const rootRoute = createRootRoute({
	component: RootLayout,
});
