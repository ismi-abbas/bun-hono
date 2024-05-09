import type { Config } from "drizzle-kit";
import { env } from "./server/env";

export default {
	schema: "./server/db/schema",
	out: "./drizzle",
	driver: "pg",
	dbCredentials: {
		connectionString: env.DATABASE_URL,
	},
} satisfies Config;
