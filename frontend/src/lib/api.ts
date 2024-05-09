import { ApiRoutes } from "@server/app";
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
