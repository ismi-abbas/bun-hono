import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

async function getTotalSpent() {
	const res = await api.expenses["total-spent"].$get();
	const data = await res.json();
	return data;
}

function Index() {
	const {
		data: totalSpent,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["get-total-spent"],
		queryFn: getTotalSpent,
	});

	return (
		<>
			{isLoading ? (
				<div className="flex flex-col space-y-3 my-4 w-full max-w-xs">
					<Skeleton className="h-[155px] w-[300px] rounded-xl" />
					<div className="space-y-2">
						<Skeleton className="h-8 w-[300px]" />
					</div>
				</div>
			) : (
				<Card className="w-full max-w-xs my-4">
					<CardHeader>
						<CardTitle>Total Spent</CardTitle>
					</CardHeader>
					<CardContent>{totalSpent?.total ? totalSpent.total : 0}</CardContent>
				</Card>
			)}

			{isError && <p>Error</p>}

			<Button className="bg-teal-700">Add Expense</Button>
		</>
	);
}
