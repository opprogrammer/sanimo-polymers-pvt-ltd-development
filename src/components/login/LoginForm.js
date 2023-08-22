import { Field, reduxForm } from "redux-form";

import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { isRequired } from "utils/validations";

const LoginForm = ({ handleSubmit, disabled }) => {
	return (
		<form className="d-flex flex-column p-4" onSubmit={handleSubmit}>
			<div className="mb-3">
				<Field
					component={ReduxFormTextField}
					label="User Name"
					name="username"
					className="form-control mt-3"
					type="text"
					placeholder="Enter username"
				/>
			</div>

			<div className="mb-3">
				<Field
					component={ReduxFormTextField}
					label="Password"
					name="password"
					className="form-control mt-3"
					type="password"
					placeholder="Enter Password"
				/>
			</div>

			<button
				className="btn btn-outline-primary mt-2"
				style={{ borderRadius: "25px" }}
				type="submit"
				disabled={disabled}
			>
				Submit
			</button>
		</form>
	);
};

export default reduxForm({
	form: "login",
	validate: values => {
		const errors = {};
		isRequired(values?.username) && (errors.username = "Required");
		isRequired(values?.password) && (errors.password = "Required");
		return errors;
	},
})(LoginForm);
