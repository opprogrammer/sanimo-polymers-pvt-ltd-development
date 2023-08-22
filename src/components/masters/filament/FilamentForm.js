import { Col, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { getIsUpdatingMasterList } from "reducers/master";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { renderModalButtons } from "utils/renderModalButtons";
import { isRequired } from "utils/validations";

const formName = "filament";

const FilamentForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
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
							maxLength={20}
							label="Filament"
							name="filament"
							placeholder="Enter Filament"
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
	fields: ["filament"],
	validate: values => {
		const errors = {};

		isRequired(values?.filament) && (errors.filament = "Required");

		return errors;
	},
})(FilamentForm);
