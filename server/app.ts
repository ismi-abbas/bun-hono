import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";
import { serveStatic } from "hono/bun";
import { authRoute } from "./routes/auth";

const app = new Hono();

app.use("*", logger());

// this is one method, but sam's method is using proxy set on vite server proxy
// app.use(
// 	"*",
// 	cors({
// 		origin: "*",
// 	})
// );
const apiRoutes = app
	.basePath("/api")
	.get("/health", async (c) => {
		return c.json({ message: "Server is running" });
	})
	.route("/expenses", expensesRoute)
	.route("/", authRoute);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
