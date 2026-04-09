export type UserRental = {
  rentalId: number;
  category: string;
  modelName: string;
  itemSerial: string;
  semester: string;
  status: "RENTING" | "OVERDUE" | "RETURNED";
};
