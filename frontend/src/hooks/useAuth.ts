import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useNavigate } from "@tanstack/react-router";

export function useAuth() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user"],
		queryFn: api.getUser,
		retry: false,
	});

	const loginMutation = useMutation({
		mutationFn: api.login,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			navigate({ to: "/" });
		},
	});

	const registerMutation = useMutation({
		mutationFn: api.register,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			navigate({ to: "/" });
		},
	});

	const logoutMutation = useMutation({
		mutationFn: api.logout,
		onSuccess: () => {
			queryClient.setQueryData(["user"], null);
			navigate({ to: "/login" });
		},
	});

	return {
		user,
		isLoading,
		error,
		login: loginMutation.mutate,
		isLoggingIn: loginMutation.isPending,
		register: registerMutation.mutate,
		isRegistering: registerMutation.isPending,
		logout: logoutMutation.mutate,
		isLoggingOut: logoutMutation.isPending,
	};
}
