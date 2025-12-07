import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { LoginForm } from "../components/auth/LoginForm";

function Login() {
	return (
		<>
			<LoginForm />
		</>
	);
}

export const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: Login,
});
