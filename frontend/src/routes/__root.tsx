import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import "../index.css";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

export const Route = createRootRoute({
	component: Root,
});

function NavBar() {
	return (
		<header className="flex items-center justify-between h-16 px-4 md:px-6 border-b">
			<Link className="flex items-center gap-2" to="/">
				<span className="text-center font-bold my-4 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
					Hono Bun App
				</span>
			</Link>
			<nav className="hidden md:flex items-center gap-4">
				<Link className="text-sm font-medium hover:underline" to="/">
					Home
				</Link>
				<Link className="text-sm font-medium hover:underline" to="/about">
					About
				</Link>

				<Link className="text-sm font-medium hover:underline" to="/expenses">
					Expenses
				</Link>
				<Link
					className="text-sm font-medium hover:underline"
					to="/create-expense"
				>
					Create
				</Link>
			</nav>
			<div className="md:hidden">
				<Button size="icon" variant="outline">
					<MenuIcon className="h-6 w-6" />
					<span className="sr-only">Toggle navigation</span>
				</Button>
			</div>
		</header>
	);
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="4" x2="20" y1="12" y2="12" />
			<line x1="4" x2="20" y1="6" y2="6" />
			<line x1="4" x2="20" y1="18" y2="18" />
		</svg>
	);
}

function Root() {
	return (
		<>
			<NavBar />
			<div className="container mx-auto bg-background">
				<Toaster />
				<Outlet />
			</div>
		</>
	);
}
