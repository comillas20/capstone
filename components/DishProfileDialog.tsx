import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
import { CldImage } from "next-cloudinary";
import ImageNotAvailable from "@components/ImageNotAvailable";
type DishProfileDialogProps = {
	data: {
		name: string;
		category: string;
		imgHref: string | null;
	};
	children: React.ReactNode;
};
export default function DishProfileDialog({
	data,
	children,
}: DishProfileDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="grid grid-cols-1 gap-4 rounded-md p-0">
				<ImageNotAvailable ratio={3 / 4}>
					{data.imgHref && (
						<CldImage
							src={data.imgHref}
							alt={data.name}
							fill
							className="rounded-s-md object-cover"
						/>
					)}
				</ImageNotAvailable>

				<div className="absolute bottom-0 flex w-full justify-between bg-slate-500/50 p-8 pb-12">
					<div>
						<h3 className="text-xl font-semibold">{data.name}</h3>
						<p className="text-sm">{data.category}</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
