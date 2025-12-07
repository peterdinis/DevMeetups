import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import HomeWrapper from "../components/home/HomeWrapper";

function Index() {
	return (
		<>
			<HomeWrapper />
		</>
	);
}

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Index,
});
