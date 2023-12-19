import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
import { CldImage } from "next-cloudinary";
import { Dishes } from "./DishColumns";
import ImageNotAvailable from "@components/ImageNotAvailable";
import { Button } from "@components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { DISHES_IMAGE_FOLDER } from "@lib/utils";
export default function DishProfileDialog({ data }: { data: Dishes }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					type="button"
					variant="link"
					size="sm"
					className="h-auto p-0 leading-none">
					View Current Image
				</Button>
			</DialogTrigger>
			<DialogContent className="grid grid-cols-2 gap-4 rounded-md p-0">
				<ImageNotAvailable className="min-h-[400px]">
					{data.imgHref && (
						<CldImage
							className="rounded-s-md"
							width={400}
							height={480}
							sizes="100vw"
							src={DISHES_IMAGE_FOLDER.concat(data.imgHref)}
							alt={data.name}
						/>
					)}
				</ImageNotAvailable>

				<div className="mr-4 mt-12 flex flex-col justify-between px-8 py-12">
					<div>
						<h3 className="text-lg font-semibold">{data.name}</h3>
						<p className="text-xs">{data.category}</p>
					</div>
					<DialogClose asChild>
						<Button type="button" size="sm" className="w-full">
							Close
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}
