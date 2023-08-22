import { Col, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { getIsUpdatingMasterList } from "reducers/master";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { renderModalButtons } from "utils/renderModalButtons";
import { isRequired } from "utils/validations";

const formName = "process";

const ProcessForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);

	return (
		<form onSubmit={handleSubmit}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col className="mb-2">
						<Field
							component={ReduxFormTextField}
							maxLength={50}
							label="Process Code"
							name="code"
							placeholder="Enter Process Code"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-2">
						<Field
							component={ReduxFormTextField}
							maxLength={50}
							label="Process Name"
							name="name"
							placeholder="Enter Process Name"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
			</Modal.Body>
			{renderModalButtons(onCancel, isUpdatingMaster || isViewOnly)}
		</form>
	);
};

export default reduxForm({
	form: formName,
	fields: ["code", "name"],
	validate: values => {
		const errors = {};

		isRequired(values?.code) && (errors.code = "Required");
		isRequired(values?.name) && (errors.name = "Required");

		return errors;
	},
})(ProcessForm);
