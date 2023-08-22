import axios from "axios";

import {
	CLEAR_USER_DETAILS,
	LOGIN_USER,
	LOGOUT_USER,
	SELECT_COMPANY,
	SELECT_FINANCIAL_YEAR,
} from "constants/user";

import apiConfig from "./apiConfig";

export const userLogin = body => async dispatch => {
	try {
		dispatch({ type: LOGIN_USER.REQUEST });

		const config = {
			headers: {
				"Content-Type": "application/json",
			},
		};

		const { data } = await axios.post(
			`${apiConfig?.baseURL}/v1/user/login`,
			body,
			config
		);

		dispatch({
			type: LOGIN_USER.SUCCESS,
			payload: {
				success: "success",
				data,
			},
		});
	} catch (error) {
		dispatch({ type: LOGIN_USER.FAILURE, payload: error });
	}
};

export const userLogout = () => async (dispatch, getState) => {
	try {
		dispatch({ type: LOGOUT_USER.REQUEST });

		const { userId } = getState().userDetails;
		const config = { headers: apiConfig?.getHeaders() };

		await axios.get(`${apiConfig?.baseURL}/v1/user/${userId}/logout`, config);

		dispatch({
			type: LOGOUT_USER.SUCCESS,
			payload: {
				success: "success",
			},
		});
	} catch (error) {
		dispatch({ type: LOGOUT_USER.FAILURE, payload: error });
	}
};

export const selectCompany = companyId => async dispatch => {
	dispatch({ type: SELECT_COMPANY, payload: companyId });
};

export const selectFinancialYear = financialYearId => async dispatch => {
	dispatch({ type: SELECT_FINANCIAL_YEAR, payload: financialYearId });
};

export const clearUserDetails = () => async dispatch => {
	dispatch({ type: CLEAR_USER_DETAILS });
};
