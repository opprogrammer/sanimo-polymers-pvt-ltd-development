import axios from "axios";
import debounce from "lodash-es/debounce";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";

import { getUserDetails } from "reducers/user";

import apiConfig from "actions/apiConfig";
import { Tooltip } from "antd";
import { useMemo } from "react";
import { selectCustomStyles } from "./ReduxFormSelectField";
import stringifyQueryParams from "./stringifyQueryParams";

export const ReduxFormAsyncSelect = props => {
	const {
		input,
		disabled,
		touched,
		error,
		masterDropdownName,
		isMulti = false,
		label = null,
		query = {},
		status = 2,
		menuPosition = "relative",
		className = "mt-3",
		isSubForm = false,
	} = props;

	const { userId } = useSelector(getUserDetails);

	const config = {
		headers: apiConfig?.getHeaders(),
	};

	const loadDropdownValues = debounce((inputValue, callback) => {
		const queryString = stringifyQueryParams({
			...query,
			name: inputValue,
			dropdown: 1,
			status,
			sort: "id",
		});
		axios
			.get(
				`${apiConfig?.baseURL}/v1/user/${userId}/${masterDropdownName}/list?${queryString}`,
				config
			)
			.then(res => {
				callback(res.data.data.results);
			});
	}, 500);

	const customStyles = useMemo(
		() => selectCustomStyles(isMulti, isSubForm),
		[isMulti, isSubForm]
	);

	return (
		<>
			{label && (
				<label
					htmlFor="asyncSelectInput"
					className="ms-2 position-absolute z-2"
				>
					<span className="h6 small bg-white text-muted px-1 rounded">
						{label}
					</span>
				</label>
			)}
			<Tooltip title={touched && error ? error : null}>
				<div>
					<AsyncSelect
						{...input}
						id="asyncSelectInput"
						className={className}
						styles={customStyles}
						classNames={{
							control: () =>
								`border border-${touched && error ? "danger" : "secondary"}`,
						}}
						onBlur={() => input.onBlur()}
						defaultOptions
						loadOptions={loadDropdownValues}
						isMulti={isMulti}
						isDisabled={disabled}
						menuPosition={menuPosition}
						isClearable
					/>
				</div>
			</Tooltip>
		</>
	);
};
