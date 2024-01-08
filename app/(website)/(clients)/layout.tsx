export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-y-12">
			<div className="flex-1 space-y-4 px-32 py-4">{children}</div>
		</div>
	);
}
