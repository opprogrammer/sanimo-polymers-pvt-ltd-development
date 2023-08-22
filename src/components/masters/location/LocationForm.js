import { Col, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Field, getFormMeta, getFormSyncErrors, reduxForm } from "redux-form";

import {
	getIsFetchingDropdownList,
	getIsUpdatingMasterList,
} from "reducers/master";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { renderModalButtons } from "utils/renderModalButtons";
import { isRequired } from "utils/validations";

const formName = "location";

const LocationForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);
	const isFetchingDropdown = useSelector(getIsFetchingDropdownList);

	const meta = useSelector(getFormMeta(formName));
	const errors = useSelector(getFormSyncErrors(formName));

	return (
		<form onSubmit={handleSubmit}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col className="mb-2">
						<Field
							component={ReduxFormAsyncSelect}
							name="department_id"
							label="Department"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.department_id?.touched}
							error={errors?.department_id}
							placeholder="Department"
							masterDropdownName="department"
						/>
					</Col>
					<Col className="mb-2">
						<Field
							component={ReduxFormTextField}
							maxLength={100}
							label="Location Name"
							name="name"
							placeholder="Enter Location Name"
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
	fields: ["name", "department_id"],
	validate: values => {
		const errors = {};

		isRequired(values?.name) && (errors.name = "Required");
		isRequired(values?.department_id) && (errors.department_id = "Required");

		return errors;
	},
})(LocationForm);
