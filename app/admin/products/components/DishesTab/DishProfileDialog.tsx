import { Dialog, DialogContent, DialogTrigger } from "@components/ui/dialog";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { useTransition } from "react";
import { Dishes } from "./DishColumns";
import ImageNotAvailable from "@components/ImageNotAvailable";
import { Button } from "@components/ui/button";
import { mutate } from "swr";
import { saveDishImage } from "../serverActions";
import { toast } from "@components/ui/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
export default function DishProfileDialog({
	data,
	openDialog,
	onOpenChange,
}: {
	data: Dishes;
	openDialog: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [isSaving, startSaving] = useTransition();
	return (
		<CldUploadWidget
			uploadPreset="zy3i7msr"
			onUpload={result => {
				if (result.info) {
					if (result.info.hasOwnProperty("public_id")) {
						const info = result.info as { public_id: string };
						console.log(info.public_id);
						if (data.name) {
							startSaving(async () => {
								const dishImg = await saveDishImage(
									data.name,
									data.imgHref,
									info.public_id
								);

								if (dishImg) {
									toast({
										title: "Success",
										description:
											"The image for " + data.name + " is successfully uploaded!",
										duration: 5000,
									});
									mutate("dpGetAllDishes");
									mutate("aedGetAllCategories");
									mutate("aedGetAllCourses");
									mutate("aedGetAllDishes");

									mutate("ssaedGetAllDishes");
								}
							});
						}
					}
				}
			}}
			options={{
				sources: ["local", "url", "google_drive", "unsplash"],
				multiple: false,
			}}>
			{({ open }) => {
				return (
					<Dialog>
						<DialogTrigger asChild>
							<Button
								variant={"link"}
								className="select-none p-0 font-medium text-inherit">
								{data.name}
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
										src={data.imgHref}
										alt={data.name}
									/>
								)}
							</ImageNotAvailable>

							<div className="mr-4 mt-12 flex flex-col justify-between px-8 py-12">
								<div>
									<h3 className="text-lg font-semibold">{data.name}</h3>
									<p className="text-xs">{data.course + " | " + data.category}</p>
								</div>
								<DialogClose asChild>
									<Button onClick={() => open()} disabled={isSaving}>
										{data.imgHref ? "Replace image" : "Upload an image"}
									</Button>
								</DialogClose>
							</div>
						</DialogContent>
					</Dialog>
				);
			}}
		</CldUploadWidget>
	);
}
