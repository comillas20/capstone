export async function generateMetadata() {
	return {
		title: "Jakelou - Admin",
		description: "Admin dashboard for management",
	};
}

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <main className="flex-1 space-y-4 px-8 py-4">{children}</main>;
}
