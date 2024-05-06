import "./App.css";
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card";
import { useEffect, useState } from "react";

function App() {
	const [totalSpent, setTotalSpent] = useState(0);

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch("/api/expenses/total-spent");
			const json = await res.json();
			setTotalSpent(json.total);
		};
		fetchData();
	}, []);

	return (
		<main className="container items-center justify-center">
			<h1 className="text-center text-6xl font-bold my-4 bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
				Hono Bun App
			</h1>

			<div className="border-t" />

			<Card className="w-full max-w-xs my-4">
				<CardHeader>
					<CardTitle>Total Spent</CardTitle>
				</CardHeader>
				<CardContent>{totalSpent ? totalSpent : 0}</CardContent>
			</Card>
		</main>
	);
}

export default App;
