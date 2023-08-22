import { Tooltip } from "antd";

export const ReduxFormTextField = ({
	input,
	label,
	type = "text",
	maxLength = 200,
	placeholder,
	meta: { touched, error, warning },
	className = "mt-3",
	...inputProps
}) => {
	return (
		<>
			{label && (
				<label htmlFor="textInput" className="ms-2 position-absolute ">
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
