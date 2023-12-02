import { Reservations } from "./components/Columns";
export enum status {
	true = "Accepted",
	false = "Pending",
}

const dummyReservations: Reservations[] = [
	{
		customerName: "John Doe",
		email: "john.doe@example.com",
		mobileNumber: "555-1234",
		reservationTime: "2023-11-29T12:00:00",
		eventTime: "2023-11-30T14:00:00",
		initialEventDuration: 2,
		status: status.true,
	},
	{
		customerName: "Jane Smith",
		email: "jane.smith@example.com",
		mobileNumber: "555-5678",
		reservationTime: "2023-11-29T14:30:00",
		eventTime: "2023-12-01T10:00:00",
		initialEventDuration: 3,
		status: status.false,
	},
	{
		customerName: "John Doe",
		email: "john.doe@example.com",
		mobileNumber: null,
		reservationTime: "2023-11-29T14:30:00",
		eventTime: "2023-12-01T10:00:00",
		initialEventDuration: 3,
		status: status.false,
	},
	{
		customerName: "Mario Mario",
		email: null,
		mobileNumber: "09123456789",
		reservationTime: "2023-11-29T14:30:00",
		eventTime: "2023-12-01T10:00:00",
		initialEventDuration: 3,
		status: status.false,
	},
	// Add more dummy data as needed
];

export default dummyReservations;
