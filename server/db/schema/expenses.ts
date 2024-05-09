import { pgTable, serial, text, numeric, index, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable(
	"expenses",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id").notNull(),
		title: text("title").notNull(),
		amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
		date: date("date").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
	},
	(expense) => {
		return {
			userIdIndex: index("name_idx").on(expense.userId),
		};
	}
);

// Schema for inserting a user - can be used to validate API requests
export const insertExpenseSchema = createInsertSchema(expenses, {
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters long" })
		.max(20, { message: "Title must be at most 20 characters long" }),
	amount: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Amount must be positive" }),
});

// Schema for selecting a Expenses - can be used to validate API responses
export const selectExpenseSchema = createSelectSchema(expenses);
