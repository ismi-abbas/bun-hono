import { createFileRoute } from "@tanstack/react-router";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/profile")({
	component: Profile,
});

export default function Profile() {
	const { isPending, data, error } = useQuery(userQueryOptions);

	function logout() {
		window.location.href = "/api/logout";
	}

	if (isPending) {
		return (
			<div className="flex flex-col items-center justify-center gap-6 py-12 border rounded-md">
				<Skeleton className="size-32" />
				<Skeleton className="text-4xl font-bold" />
				<Skeleton className="text-gray-500 dark:text-gray-400" />
			</div>
		);
	}

	if (error) {
		return <p>User not logged in</p>;
	}

	return (
		<div className="flex flex-col items-center justify-center gap-6 py-12 border rounded-md">
			<Avatar className="size-32">
				{data?.user.picture !== null ? (
					<AvatarImage alt="@shadcn" src={data?.user.picture} />
				) : (
					<AvatarFallback>JP</AvatarFallback>
				)}
			</Avatar>
			<div className="space-y-1 text-center">
				<h1 className="text-4xl font-bold">{data?.user.given_name}</h1>
				<p className="text-gray-500 dark:text-gray-400">{data?.user.email}</p>
			</div>

			<Button onClick={logout}>Logout</Button>
		</div>
	);
}
