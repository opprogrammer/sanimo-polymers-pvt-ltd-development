import { store } from "store";

const getDataFromStore = () => {
	const state = store.getState();

	const { token, userId, selectedCompanyId, selectedFinancialYearId } =
		state.userDetails;

	return {
		token,
		userId,
		selectedCompanyId,
		selectedFinancialYearId,
	};
};

// Config object for API calls
const apiConfig = {
	baseURL: "http://68.178.167.176:8000", // Your API base URL
	headers: {
		"Content-Type": "application/json",
	},
	// Function to add additional headers with data from the Redux store
	getHeaders: () => {
		const { token, selectedCompanyId, selectedFinancialYearId } =
			getDataFromStore();

		return {
			...apiConfig.headers,
			"Session-Token": token,
			"Company-Id": selectedCompanyId,
			"Financial-Year-Id": selectedFinancialYearId,
		};
	},
};

export default apiConfig;
