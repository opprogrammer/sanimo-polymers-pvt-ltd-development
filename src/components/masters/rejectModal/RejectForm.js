import { Col, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Field, getFormMeta, getFormSyncErrors, reduxForm } from "redux-form";

import { Tooltip } from "antd";
import { getIsUpdatingMasterList } from "reducers/master";
import { renderModalButtons } from "utils/renderModalButtons";
import { isRequired } from "utils/validations";

const formName = "reject";
const RejectForm = ({ onCancel, handleSubmit }) => {
	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);
	const errors = useSelector(getFormSyncErrors(formName));
	const meta = useSelector(getFormMeta(formName));

	return (
		<form onSubmit={handleSubmit}>
			<Modal.Header closeButton>
				<Modal.Title>
					<span style={{ textTransform: "capitalize" }}>Reject Reason</span>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row className="mb-3">
					<Tooltip
						title={
							meta?.reject_reason?.touched && errors?.reject_reason
								? errors?.reject_reason
								: null
						}
					>
						<Col>
							<Field
								component="textarea"
								maxLength={250}
								className={`form-control border border-${
									meta?.reject_reason?.touched && errors?.reject_reason
										? "danger"
										: "secondary"
								}`}
								rows="4"
								label="Reject Reason"
								name="reject_reason"
								placeholder="Enter Reject Reason"
							/>
						</Col>
					</Tooltip>
				</Row>
			</Modal.Body>
			{renderModalButtons(onCancel, isUpdatingMaster)}
		</form>
	);
};

export default reduxForm({
	form: formName,
	validate: values => {
		const errors = {};

		isRequired(values?.reject_reason) && (errors.reject_reason = "Required");

		return errors;
	},
})(RejectForm);
