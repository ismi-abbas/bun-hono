import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Label } from "@radix-ui/react-label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FieldApi, useForm } from "@tanstack/react-form";

export const Route = createFileRoute("/create-expense")({
	component: CreateExpense,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
	return (
		<>
			{field.state.meta.touchedErrors ? (
				<em>{field.state.meta.touchedErrors}</em>
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	);
}

function CreateExpense() {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			title: "",
			amount: 0,
		},
		onSubmit: async ({ value }) => {
			await new Promise((r) => setTimeout(r, 3000));

			const res = await api.expenses.$post({
				json: value,
			});

			if (!res.ok) {
				console.log(await res.text());
				throw new Error("Failed to create expense");
			}
			console.log(value);

			navigate({ to: "/expenses" });
		},
	});
	return (
		<div className="flex items-center flex-col">
			<h2>Create Expense</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					void form.handleSubmit();
				}}
				className="flex flex-col space-y-3 w-full max-w-sm"
			>
				<form.Field
					name="title"
					children={(field) => (
						<>
							<Label>Title</Label>
							<Input
								type="text"
								placeholder="Title"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldInfo field={field} />
						</>
					)}
				/>
				<form.Field
					name="amount"
					children={(field) => (
						<>
							<Label htmlFor={field.name}>Amount</Label>
							<Input
								type="number"
								placeholder="Amount"
								id={field.name}
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(Number(e.target.value))}
							/>
							<FieldInfo field={field} />
						</>
					)}
				/>

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => {
						return (
							<div className="flex justify-center">
								<Button type="submit" disabled={!canSubmit || isSubmitting}>
									{isSubmitting ? "Submitting..." : "Submit"}
								</Button>
							</div>
						);
					}}
				/>
			</form>
		</div>
	);
}
