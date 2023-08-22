import { Col, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { getIsUpdatingMasterList } from "reducers/master";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { renderModalButtons } from "utils/renderModalButtons";
import { isRequired } from "utils/validations";

const formName = "financialYear";

const FinancialYearForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
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
							maxLength={35}
							label="Name"
							name="name"
							placeholder="Enter Name"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-2">
						<Field
							component={ReduxFormTextField}
							type="date"
							max="9999-12-31"
							label="Start Date"
							name="start_date"
							placeholder="Enter Start Date"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-2">
						<Field
							component={ReduxFormTextField}
							type="date"
							max="9999-12-31"
							label="End Date"
							name="end_date"
							placeholder="Enter End Date"
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
	fields: ["name", "start_date", "end_date"],
	validate: values => {
		const errors = {};

		isRequired(values?.name) && (errors.name = "Required");
		isRequired(values?.start_date) && (errors.start_date = "Required");
		isRequired(values?.end_date) && (errors.end_date = "Required");

		return errors;
	},
})(FinancialYearForm);
