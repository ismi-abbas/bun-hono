import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const expenseSchema = z.object({
	id: z.number().int().positive().min(1),
	title: z.string().min(3).max(100),
	amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const createPostScheme = expenseSchema.omit({ id: true });

const fakeExpenses: Array<Expense> = [
	{ id: 1, title: "rent", amount: 100 },
	{ id: 2, title: "car payment", amount: 200 },
];

export const expensesRoute = new Hono()
	.get("/", (c) => {
		return c.json({ expenses: [...fakeExpenses] });
	})
	.post("/", zValidator("json", createPostScheme), async (c) => {
		const data = c.req.valid("json");
		fakeExpenses.push({ ...data, id: fakeExpenses.length + 1 });
		return c.json(data);
	})
	.get("/:id{[0-9]+}", (c) => {
		const id = Number.parseInt(c.req.param("id"));

		const expense = fakeExpenses.find((e) => e.id === Number(id));

		if (!expense) {
			return c.notFound();
		}

		return c.json({ expense });
	})
	.delete("/:id{[0-9]+}", (c) => {
		const id = Number.parseInt(c.req.param("id"));

		const expense = fakeExpenses.findIndex((e) => e.id === Number(id));

		if (expense === -1) {
			return c.notFound();
		}

		const deletedExpense = fakeExpenses.splice(expense, 1)[0];

		return c.json({ expense: deletedExpense });
	});
