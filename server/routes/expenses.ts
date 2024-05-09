import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { db } from "../db";
import { expenses as expensesTable, insertExpenseSchema, selectExpenseSchema } from "../db/schema/expenses";
import { and, desc, eq, sum } from "drizzle-orm";
import { getUserMiddleware } from "../kinde";
import { createExpenseSchema } from "../sharedTypes";

export const expensesRoute = new Hono()
	.get("/", getUserMiddleware, async (c) => {
		const user = c.var.user;
		const expenses = await db
			.select()
			.from(expensesTable)
			.where(eq(expensesTable.userId, user.id))
			.orderBy(desc(expensesTable.date))
			.limit(100);

		return c.json({ expenses });
	})
	.post("/", getUserMiddleware, zValidator("json", createExpenseSchema), async (c) => {
		const data = c.req.valid("json");
		const user = c.var.user;

		const validatedExpense = insertExpenseSchema.parse({
			...data,
			userId: user.id,
		});

		const result = await db
			.insert(expensesTable)
			.values(validatedExpense)
			.returning()
			.then((res) => res[0]);

		return c.json(result);
	})
	.get("/:id{[0-9]+}", getUserMiddleware, async (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const user = c.var.user;

		const expense = await db
			.select()
			.from(expensesTable)
			.where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
			.then((res) => res[0]);

		if (!expense) {
			return c.notFound();
		}

		return c.json({ expense });
	})
	.get("/total-spent", getUserMiddleware, async (c) => {
		const user = c.var.user;

		const result = await db
			.select({ total: sum(expensesTable.amount) })
			.from(expensesTable)
			.where(eq(expensesTable.userId, user.id))
			.then((res) => res[0]);

		return c.json(result);
	})
	.delete("/:id{[0-9]+}", getUserMiddleware, async (c) => {
		const id = Number.parseInt(c.req.param("id"));
		const user = c.var.user;

		const deleted = await db
			.delete(expensesTable)
			.where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
			.returning()
			.then((res) => res[0]);

		if (!deleted) {
			return c.notFound();
		}

		return c.json({ expense: deleted });
	});
