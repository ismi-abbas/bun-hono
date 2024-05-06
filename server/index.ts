import app from "./app";

const server = Bun.serve({
	port: process.env.PORT || 8080,
	fetch: app.fetch,
});

console.log("Server running on ", server.port);
