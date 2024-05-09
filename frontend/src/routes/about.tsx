import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
	component: () => (
		<div>
			<h1 className="text-4xl font-medium">Spending Tracker</h1>

			<section className="flex flex-col space-y-5 mt-3">
				<p className="leading-snug text-justify">
					Spending Tracker is a simple web app to track your spending. You can log in with your Google account and see
					how much you've spent on different categories over time. The app is built with TypeScript, React, and modern
					CSS. Feel free to check out the source code on GitHub!
				</p>
				<p className="leading-snug text-justify">
					The app is still in development, but the basic functionality is there. You can create new expenses, see a
					chart of your spending, and edit or delete old expenses. The app is also responsive, so it should work well on
					desktop and mobile devices.
				</p>

				<p className="leading-snug text-justify">
					I built this app as a way to learn more about web development and to have a tool to help me keep track of my
					spending. If you have any feedback or want to report a bug, please open an issue on the GitHub page. Thanks
					for checking it out!
				</p>

				<div className="w-full flex items-center justify-center">
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="outline">Open popover</Button>
						</PopoverTrigger>
						<PopoverContent className="w-80">
							<div className="grid gap-4">
								<div className="space-y-2">
									<h4 className="font-medium leading-none">Dimensions</h4>
									<p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
								</div>
								<div className="grid gap-2">
									<div className="grid grid-cols-3 items-center gap-4">
										<Label htmlFor="width">Width</Label>
										<Input id="width" defaultValue="100%" className="col-span-2 h-8" />
									</div>
									<div className="grid grid-cols-3 items-center gap-4">
										<Label htmlFor="maxWidth">Max. width</Label>
										<Input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
									</div>
									<div className="grid grid-cols-3 items-center gap-4">
										<Label htmlFor="height">Height</Label>
										<Input id="height" defaultValue="25px" className="col-span-2 h-8" />
									</div>
									<div className="grid grid-cols-3 items-center gap-4">
										<Label htmlFor="maxHeight">Max. height</Label>
										<Input id="maxHeight" defaultValue="none" className="col-span-2 h-8" />
									</div>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</section>
		</div>
	),
});
