import { Button } from "@/components/ui/button";
import { userQueryOptions } from "@/lib/api";
import { Outlet, createFileRoute } from "@tanstack/react-router";

function Login() {
	return (
		<div className="flex border rounded-md p-10 flex-col items-center">
			<h1>Please Login or Register</h1>

			<div className="flex gap-2 mt-2">
				<Button size="sm">
					<a href="/api/login">Login</a>
				</Button>

				<Button size="sm">
					<a href="/api/register">Register</a>
				</Button>
			</div>
		</div>
	);
}

const Component = () => {
	const { user } = Route.useRouteContext();

	if (!user) {
		return <Login />;
	}

	return <Outlet />;
};

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;

		try {
			const data = await queryClient.fetchQuery(userQueryOptions);
			return data;
		} catch (error) {
			console.error(error);
			return { user: null };
		}
	},
	component: Component,
});
