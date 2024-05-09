import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { Label } from "@radix-ui/react-label";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FieldApi, useForm } from "@tanstack/react-form";

import { zodValidator } from "@tanstack/zod-form-adapter";

import { createExpenseSchema } from "@server/sharedTypes";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/create-expense")({
	component: CreateExpense,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
	return (
		<>
			{field.state.meta.touchedErrors ? (
				<span className="text-red-500 text-xs">{field.state.meta.touchedErrors}</span>
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
			amount: "0",
			date: new Date().toISOString(),
		},
		onSubmit: async ({ value }) => {
			const res = await api.expenses.$post({
				json: value,
			});

			if (!res.ok) {
				console.log(await res.text());
				throw new Error("Failed to create expense");
			}

			navigate({ to: "/expenses" });
		},
		validatorAdapter: zodValidator,
	});
	return (
		<div className="flex items-center flex-col border rounded-md p-10">
			<h2 className="font-bold text-2xl">Create Expense</h2>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					void form.handleSubmit();
				}}
				className="flex flex-col space-y-3 w-full max-w-sm"
			>
				<form.Field
					validators={{
						onChange: createExpenseSchema.shape.title,
					}}
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
					validators={{
						onChange: createExpenseSchema.shape.amount,
					}}
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
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldInfo field={field} />
						</>
					)}
				/>

				{/* Date Picker */}
				<form.Field
					name="date"
					validators={{
						onChange: createExpenseSchema.shape.date,
					}}
					children={(field) => (
						<>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"w-[240px] justify-start text-left font-normal",
											!field.state.value && "text-muted-foreground"
										)}
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{field.state.value ? format(field.state.value, "PPP") : <span>Pick a date</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0 bg-white" align="start">
									<Calendar
										mode="single"
										selected={new Date(field.state.value)}
										onSelect={(date) => field.handleChange((date ?? new Date()).toISOString())}
										className="rounded-md border"
									/>
								</PopoverContent>
							</Popover>

							{field.state.meta.touchedErrors ? <em>{field.state.meta.touchedErrors}</em> : null}
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
