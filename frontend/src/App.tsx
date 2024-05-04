import "./App.css";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
	CardFooter,
} from "./components/ui/card";

function App() {
	return (
		<main className="container items-center justify-center">
			<h1>Hono Bun App</h1>

			<div className="grid grid-cols-3 gap-3 my-2">
				{Array.from({ length: 6 }).map((_, i) => (
					<Card className="w-full max-w-sm" key={i}>
						<CardHeader>
							<CardTitle>Card title</CardTitle>
						</CardHeader>
						<CardContent>Card Content</CardContent>
						<CardFooter>Card Footer</CardFooter>
					</Card>
				))}
			</div>

			<div className="flex gap-2">
				<Button>Add</Button>
				<Button>Remove</Button>
			</div>
		</main>
	);
}

export default App;
