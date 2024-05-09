import { ApiRoutes } from "@server/app";
import type { CreateExpense } from "@server/sharedTypes";
import { queryOptions } from "@tanstack/react-query";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;

async function getProfile() {
	const res = await api.me.$get();
	if (!res.ok) {
		throw new Error("Failed to get profile");
	}
	const data = await res.json();
	return data;
}

export const userQueryOptions = queryOptions({
	queryKey: ["get-profile"],
	queryFn: getProfile,
	staleTime: Infinity,
});

export const getAllExpensesQueryOptions = queryOptions({
	queryKey: ["get-expenses"],
	queryFn: getAllExpenses,
	staleTime: 1000 * 60 * 5,
});

export async function getAllExpenses() {
	const res = await api.expenses.$get();

	if (!res.ok) {
		throw new Error("Server error");
	}
	const data = await res.json();
	return data;
}

export async function createExpense(value: CreateExpense) {
	await new Promise((r) => setTimeout(r, 3000));
	const res = await api.expenses.$post({
		json: value,
	});

	if (!res.ok) {
		console.log(await res.text());
		throw new Error("Failed to create expense");
	}

	const newExpense = await res.json();

	return newExpense;
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
	expense?: CreateExpense;
}>({
	queryKey: ["loading-create-expense"],
	queryFn: () => {
		return {};
	},
	staleTime: Infinity,
});
