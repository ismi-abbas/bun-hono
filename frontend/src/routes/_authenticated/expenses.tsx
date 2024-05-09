import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast, useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/expenses")({
	component: Expenses,
});

async function getAllExpenses() {
	const res = await api.expenses.$get();
	const data = await res.json();
	return data;
}

async function deleteExpense(id: string) {
	const res = await api.expenses[":id{[0-9]+}"].$delete({ param: { id } });
	if (!res.ok) {
		throw new Error("Failed to delete expense");
	}

	toast({
		title: "Expense record deleted!",
	});
	return;
}

function Expenses() {
	const client = useQueryClient();
	const { toast } = useToast();
	const { data, isLoading } = useQuery({
		queryKey: ["get-expenses"],
		queryFn: getAllExpenses,
	});

	const { mutate } = useMutation({
		mutationKey: ["delete-expense"],
		mutationFn: deleteExpense,
		onSuccess: () => client.invalidateQueries({ queryKey: ["get-expenses"] }),
		onError: (e) => {
			toast({
				title: "Failed to delete expense",
				description: e.stack,
			});
		},
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
						<TableHead className="text-right">Date</TableHead>
						<TableHead className="text-right">Action</TableHead>
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
						: data?.expenses.map(({ amount, id, title, date }) => (
								<TableRow key={id}>
									<TableCell className="font-medium">{id}</TableCell>
									<TableCell className="capitalize">{title}</TableCell>
									<TableCell className="text-right">${amount}</TableCell>
									<TableCell className="text-right">{date}</TableCell>
									<TableCell className="text-right gap-2 flex justify-end" align="right">
										<Button size="sm" className="bg-rose-700 &:hover:bg-rose-800" onClick={() => mutate(id.toString())}>
											Delete
										</Button>
										<Button size="sm" className="bg-teal-700">
											Edit
										</Button>
									</TableCell>
								</TableRow>
							))}
				</TableBody>
			</Table>
		</div>
	);
}
