import { Hono } from "hono";
import { logger } from "hono/logger";
import { expensesRoute } from "./routes/expenses";

const app = new Hono();
app.use("*", logger());

app.get("/", (ctx) => ctx.text("Hello, Hono!"));

app.get("/test", (ctx) => {
	return ctx.json({ message: "Test!" });
});

app.route("/api/expenses", expensesRoute);

export default app;
