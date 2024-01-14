export enum WorksheetNames {
	DCC = "Products-Dishes",
	Set = "Sets",
}

export type DCC = {
	name: string;
	createdAt: Date;
	isAvailable: boolean;
	category: string;
	course: string;
	imgHref: string | null;
};

export type Set = {
	name: string;
	description: string | null;
	createdAt: Date;
	minimumPerHead: number;
	price: number;
	selectionQuantity: number;
	subSets: {
		name: string;
		course: string;
		dishes: {
			name: string;
			createdAt: Date;
			isAvailable: boolean;
			category: string;
			course: string;
			imgHref: string | null;
		}[];
	}[];
};
