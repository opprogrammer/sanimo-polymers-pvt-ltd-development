import { Tooltip } from "antd";
import { useMemo } from "react";
import Select from "react-select";

export const selectCustomStyles = (isMulti, isSubForm) => ({
	menu: styles => ({
		...styles,
		zIndex: 3,
	}),
	control: styles => ({
		...styles,
		height: !isMulti && (isSubForm ? "29px !important" : "28px !important"),
		minHeight: "28px",
	}),
	container: styles => ({
		...styles,
		top: isSubForm ? 1 : 0,
	}),
	valueContainer: styles => ({
		...styles,
		marginBottom: !isMulti && 8,
	}),
	multiValue: styles => ({
		...styles,
		position: "relative",
		bottom: !isMulti && 4,
	}),
	indicatorsContainer: styles => ({
		...styles,
		height: !isMulti && "28px !important",
	}),
});

export const ReduxFormSelectField = props => {
	const {
		input,
		options,
		disabled,
		touched,
		error,
		label = null,
		isMulti = false,
		menuPosition = "relative",
		className = "mt-3",
		isSubForm = false,
	} = props;

	const customStyles = useMemo(
		() => selectCustomStyles(isMulti, isSubForm),
		[isMulti, isSubForm]
	);

	return (
		<>
			{label && (
				<label htmlFor="selectInput" className="ms-2 position-absolute z-2">
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
