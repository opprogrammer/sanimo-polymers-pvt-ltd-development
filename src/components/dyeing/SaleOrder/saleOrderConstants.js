export const tableName = "sale-order";

export const mainCategoryOptions = [
	{ label: "Dyed", value: "Dyed" },
	{ label: "Non-Dyed", value: "Non-Dyed" },
];

export const saleOrderStatuses = [
	{ label: "Pending", value: 1 },
	{ label: "Partial", value: 2 },
	{ label: "Completed", value: 3 },
	{ label: "Pre Closed", value: 4 },
	{ label: "Cancelled", value: 5 },
];

export const dyedOrderCategoryOptions = [
	{ label: "Program Order", value: "Program Order" },
	{ label: "For Stock Order", value: "For Stock Order" },
	{ label: "Job Work Order", value: "Job Work Order" },
	{ label: "Export Order", value: "Export Order" },
];

export const nonDyedOrderCategoryOptions = [
	...dyedOrderCategoryOptions,
	{ label: "From Ready Stock", value: "From Ready Stock" },
	{ label: "Trading", value: "Trading" },
];

export const batchTypeOptions = [
	{ label: "Small Batch", value: "Small Batch" },
	{ label: "Big Batch", value: "Big Batch" },
];
