import { createFileRoute } from "@tanstack/react-router";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
	component: Profile,
});

export default function Profile() {
	const { data } = useQuery({
		queryKey: ["get-profile"],
		queryFn: async () => {
			const res = await api.me.$get();
			const data = await res.json();
			console.log(data);
			return data;
		},
	});
	return (
		<div className="flex flex-col items-center justify-center gap-6 py-12 border rounded-md max-w-lg">
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

			<Button onClick={() => {}}>Logout</Button>
		</div>
	);
}
