import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import "../index.css";

export const Route = createRootRoute({
	component: Root,
});

function NavBar() {
	return (
		<nav className="p-2 flex gap-2 flex-1 justify-center">
			<Link to="/" className="[&.active]:font-bold">
				Home
			</Link>{" "}
			<Link to="/about" className="[&.active]:font-bold">
				About
			</Link>
			<Link to="/expenses" className="[&.active]:font-bold">
				Expenses
			</Link>
			<Link to="/create-expense" className="[&.active]:font-bold">
				Create
			</Link>
		</nav>
	);
}

function Root() {
	return (
		<>
			<NavBar />
			<hr />
			<div className="container mx-auto bg-background">
				<h1 className="text-center text-6xl font-bold my-4 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
					Hono Bun App
				</h1>
				<Outlet />
			</div>
		</>
	);
}
