import axios from "axios";

import {
	ADD_MASTER_LIST,
	EDIT_MASTER_LIST,
	EXPORT_MASTER,
	GET_MASTER_DETAILS,
	GET_MASTER_LIST,
	IMPORT_MASTER,
	RESET_MASTER_DETAILS,
} from "constants/master";
import stringifyQueryParams from "utils/stringifyQueryParams";

import apiConfig from "./apiConfig";
import { addNotification } from "./notifications";

export const getMasterList =
	(masterName, query = {}) =>
	async (dispatch, getState) => {
		try {
			const queryString = stringifyQueryParams(query);
			dispatch({ type: GET_MASTER_LIST.REQUEST });

			const { userId } = getState().userDetails;
			const config = { headers: apiConfig?.getHeaders() };

			const { data } = await axios.get(
				`${apiConfig?.baseURL}/v1/user/${userId}/${masterName}/list?${queryString}`,
				config
			);

			dispatch({
				type: GET_MASTER_LIST.SUCCESS,
				payload: {
					success: "success",
					data,
					masterName,
					query,
				},
			});
		} catch (error) {
			dispatch({ type: GET_MASTER_LIST.FAILURE, payload: error });
		}
	};

export const getMasterDetails =
	(masterName, id) => async (dispatch, getState) => {
		try {
			dispatch({ type: GET_MASTER_DETAILS.REQUEST });

			const { userId } = getState().userDetails;
			const config = { headers: apiConfig?.getHeaders() };

			const { data } = await axios.get(
				`${apiConfig?.baseURL}/v1/user/${userId}/${masterName}/list?id=${id}`,
				config
			);

			dispatch({
				type: GET_MASTER_DETAILS.SUCCESS,
				payload: {
					success: "success",
					data,
					masterName,
				},
			});
		} catch (error) {
			dispatch({ type: GET_MASTER_DETAILS.FAILURE, payload: error });
		}
	};

export const resetMasterDetails = masterName => async dispatch => {
	dispatch({ type: RESET_MASTER_DETAILS, payload: { masterName } });
};

export const addMasterList =
	(
		masterName,
		masterData,
		status = null,
		configType = "application/json",
		navigationFunction = null
	) =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: ADD_MASTER_LIST.REQUEST });

			const { userId } = getState().userDetails;
			const config = {
				headers: {
					...apiConfig?.getHeaders(),
					"Content-Type": configType,
				},
			};
			const { data } = await axios.post(
				`${apiConfig?.baseURL}/v1/user/${userId}/${masterName}/create`,
				masterData,
				config
			);

			if (navigationFunction) navigationFunction();

			dispatch({
				type: ADD_MASTER_LIST.SUCCESS,
				payload: {
					success: "success",
					data,
					status,
					masterName,
					navigated: !!navigationFunction,
				},
			});
		} catch (error) {
			dispatch({ type: ADD_MASTER_LIST.FAILURE, payload: error });
		}
	};

export const editMasterList =
	(
		masterName,
		masterData,
		status = null,
		configType = "application/json",
		navigationFunction = null
	) =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: EDIT_MASTER_LIST.REQUEST });

			const { userId } = getState().userDetails;
			const config = {
				headers: {
					...apiConfig?.getHeaders(),
					"Content-Type": configType,
				},
			};

			const { data } = await axios.post(
				`${apiConfig?.baseURL}/v1/user/${userId}/${masterName}/update`,
				masterData,
				config
			);

			if (navigationFunction) navigationFunction();

			dispatch({
				type: EDIT_MASTER_LIST.SUCCESS,
				payload: {
					success: "success",
					data,
					status,
					masterName,
					navigated: !!navigationFunction,
				},
			});
		} catch (error) {
			dispatch({ type: EDIT_MASTER_LIST.FAILURE, payload: error });
		}
	};

export const exportMasterList =
	(master, status = null) =>
	async (dispatch, getState) => {
		try {
			dispatch({ type: EXPORT_MASTER.REQUEST });

			const { userId } = getState().userDetails;
			const config = { headers: apiConfig?.getHeaders() };

			const { data } = await axios.post(
				`${
					apiConfig?.baseURL
				}/user/${userId}/bulk/export/master?status=${+status}`,
				{ master },
				config
			);

			let a = document.createElement("a");
			a.href = data?.data?.url;
			a.click();

			dispatch({
				type: EXPORT_MASTER.SUCCESS,
				payload: {
					success: "success",
				},
			});
		} catch (error) {
			dispatch({ type: EXPORT_MASTER.FAILURE, payload: error });
		}
	};

export const importMaster =
	(formData, masterName, status) => async (dispatch, getState) => {
		try {
			dispatch({ type: IMPORT_MASTER.REQUEST });

			const { userId } = getState().userDetails;
			const config = {
				headers: {
					...apiConfig?.getHeaders(),
					"Content-Type": "multipart/form-data",
				},
			};

			const { data } = await axios.post(
				`${apiConfig?.baseURL}/user/${userId}/bulk/upload/master`,
				formData,
				config
			);

			if (!data?.data?.url) {
				dispatch(
					addNotification({ message: data?.data?.message, type: "success" })
				);
			} else {
				let a = document.createElement("a");
				a.href = data?.data?.url;
				a.click();
				dispatch(
					addNotification({ message: data?.data?.message, type: "error" })
				);
			}

			dispatch({
				type: IMPORT_MASTER.SUCCESS,
				payload: {
					success: "success",
					masterName,
					status,
				},
			});
		} catch (error) {
			dispatch({ type: IMPORT_MASTER.FAILURE, payload: error });
		}
	};
