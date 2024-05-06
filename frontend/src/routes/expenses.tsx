import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/expenses")({
	component: Expenses,
});

async function getAllExpenses() {
	const res = await api.expenses.$get();
	const data = await res.json();
	return data;
}

function Expenses() {
	const { data, isLoading } = useQuery({
		queryKey: ["get-expenses"],
		queryFn: getAllExpenses,
	});

	return (
		<div>
			<Table>
				<TableCaption>A list of your recent expenses.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Invoice</TableHead>
						<TableHead>Title</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading
						? Array(3)
								.fill(0)
								.map((_, i) => (
									<TableRow key={i}>
										<TableCell className="font-medium">
											<Skeleton className="h-4" />
										</TableCell>
										<TableCell className="capitalize">
											<Skeleton className="h-4" />
										</TableCell>
										<TableCell className="text-right">
											<Skeleton className="h-4" />
										</TableCell>
									</TableRow>
								))
						: data?.expenses.map(({ amount, id, title }) => (
								<TableRow>
									<TableCell className="font-medium">{id}</TableCell>
									<TableCell className="capitalize">{title}</TableCell>
									<TableCell className="text-right">${amount}</TableCell>
								</TableRow>
							))}
				</TableBody>
			</Table>
		</div>
	);
}
