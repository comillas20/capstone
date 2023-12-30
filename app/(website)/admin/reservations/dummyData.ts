import { Reservations } from "./components/Columns";
export enum status {
	true = "Accepted",
	false = "Pending",
}

const dummyReservations: Reservations[] = [
	{
		id: "Asdf",
		customerName: "John Doe",
		mobileNumber: "555-1234",
		totalPaid: 10000,
		totalPrice: 15000,
		reservationTime: "2023-11-29T12:00:00",
		eventTime: "2023-11-30T14:00:00",
		eventDuration: 2,
		status: status.true,
	},
	{
		id: "aaaa",
		customerName: "Jane Smith",
		mobileNumber: "555-5678",
		totalPaid: 10000,
		totalPrice: 20000,
		reservationTime: "2023-11-29T14:30:00",
		eventTime: "2023-12-01T10:00:00",
		eventDuration: 3,
		status: status.false,
	},
	{
		id: "123",
		customerName: "John Doe",
		mobileNumber: "09123455748",
		totalPaid: 10000,
		totalPrice: 15000,
		reservationTime: "2023-11-29T14:30:00",
		eventTime: "2023-12-01T10:00:00",
		eventDuration: 3,
		status: status.false,
	},
	{
		id: "0000",
		customerName: "Mario Mario",
		mobileNumber: "09123456789",
		totalPaid: 0,
		totalPrice: 15000,
		reservationTime: "2023-11-29T14:30:00",
		eventTime: "2023-12-01T10:00:00",
		eventDuration: 3,
		status: status.false,
	},
	{
		id: "tsgsdf",
		customerName: "Jin",
		mobileNumber: "09123456789",

		totalPaid: 20000,
		totalPrice: 20000,
		reservationTime: "2023-11-29T14:30:00",
		eventTime: "2023-12-01T10:00:00",
		eventDuration: 3,
		status: status.false,
	},
	// Add more dummy data as needed
];

export default dummyReservations;
