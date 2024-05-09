import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "sonner";
import { api, getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/expenses")({
	component: Expenses,
});

async function deleteExpense(id: string) {
	const res = await api.expenses[":id{[0-9]+}"].$delete({ param: { id } });
	if (!res.ok) {
		throw new Error("Failed to delete expense");
	}

	toast("Expense record deleted!", {
		description: `Successfully deleted expense with id: ${id}`,
	});
	return;
}

function Expenses() {
	const client = useQueryClient();
	const { data, isLoading } = useQuery(getAllExpensesQueryOptions);
	const { data: loadingCreateExpenseObject } = useQuery(loadingCreateExpenseQueryOptions);

	const { mutate } = useMutation({
		mutationKey: ["delete-expense"],
		mutationFn: deleteExpense,
		onSuccess: () => client.invalidateQueries({ queryKey: ["get-expenses"] }),
		onError: (e) => {
			toast("Failed to delete expense", {
				description: `Failed to delete expense: ${e.message}`,
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
					{loadingCreateExpenseObject?.expense && (
						<TableRow>
							<TableCell>
								<Skeleton className="h-4" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4" />
							</TableCell>
						</TableRow>
					)}

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
										<TableCell className="text-right">
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
										<Button size="sm" onClick={() => mutate(id.toString())} variant="destructive">
											Delete
										</Button>
										<Button size="sm" variant="outline">
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
