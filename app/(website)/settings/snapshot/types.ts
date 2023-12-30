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
	createdAt: Date;
	minimumPerHead: number;
	price: number;
	subSets: {
		course: string;
		dishes: string[];
		name: string;
		selectionQuantity: number;
	}[];
};
