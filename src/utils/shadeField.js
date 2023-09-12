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

import Select from "react-select";

export const ReduxFormTextFieldShade = ({
	input,
	label,
	type = "text",
	maxLength = 200,
	placeholder,
	meta: { touched, error, warning },
	className = "mt-0.5",
	...inputProps
}) => {
	return (
		<>
			{label && (
				<label htmlFor="textInput" className="ms-2 ">
					<span className="h6 small bg-white text-muted px-1 rounded">
						{label}
					</span>
				</label>
			)}
			<Tooltip title={touched && error ? error : null}>
				<input
					{...input}
					id="textInput"
					className={`form-control ${className} border border-${
						touched && error ? "danger" : "secondary"
					}`}
					type={type}
					maxLength={maxLength}
					{...inputProps}
				/>
			</Tooltip>
		</>
	);
};



// export const selectCustomStylesShade = (isMulti, isSubForm) => ({
// 	menu: styles => ({
// 		...styles,
// 		zIndex: 3,
// 	}),
// 	control: styles => ({
// 		...styles,
// 		height: !isMulti && (isSubForm ? "29px !important" : "28px !important"),
// 		minHeight: "28px",
// 	}),
// 	container: styles => ({
// 		...styles,
// 		top: isSubForm ? 1 : 0,
// 	}),
// 	valueContainer: styles => ({
// 		...styles,
// 		marginBottom: !isMulti && 8,
// 	}),
// 	multiValue: styles => ({
// 		...styles,
// 		position: "relative",
// 		bottom: !isMulti && 4,
// 	}),
// 	indicatorsContainer: styles => ({
// 		...styles,
// 		height: !isMulti && "28px !important",
// 	}),
// });

export const ReduxFormSelectFieldShade = props => {
	const {
		input,
		options,
		disabled,
		touched,
		error,
		label = null,
		isMulti = false,
		menuPosition = "relative",
		className = "mt-0.5",
		isSubForm = false,
	} = props;

	const customStyles = useMemo(
		() => selectCustomStyles(isMulti, isSubForm),
		[isMulti, isSubForm]
	);

	return (
		<>
			{label && (
				<label htmlFor="selectInput" className="ms-2  z-2">
					<span className="h6 small bg-white text-muted px-1 rounded">
						{label}
					</span>
				</label>
			)}
			<Tooltip title={touched && error ? error : null}>
				<div>
					<Select
						{...input}
						id="selectInput"
						className={className}
						styles={customStyles}
						classNames={{
							control: () =>
								`border border-${touched && error ? "danger" : "secondary"}`,
						}}
						onChange={val =>
							isMulti
								? input?.onChange(val?.map(c => c?.value))
								: input?.onChange(val?.value || null)
						}
						value={
							isMulti
								? options?.filter(c => input?.value?.includes(c?.value))
								: options?.find(c => c?.value === input?.value) || null
						}
						onBlur={() => input.onBlur()}
						options={options}
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



export const ReduxFormAsyncSelectShade = props => {
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
		menuPosition = "absolute",
		className = "mt-0.5 mb-9 h-full",
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
					className="ms-2  z-2"
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
