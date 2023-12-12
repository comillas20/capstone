import { Separator } from "@components/ui/separator";

export default function Customers() {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between space-y-2">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">Customers</h2>
					<p className="text-muted-foreground">
						Verify, refund, and accept payments
					</p>
				</div>
			</div>
			<Separator />
		</div>
	);
}
