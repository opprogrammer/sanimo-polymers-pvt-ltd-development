import { Col, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Field, getFormMeta, getFormSyncErrors, reduxForm } from "redux-form";

import { stateOptions } from "constants/master";
import {
	getIsFetchingDropdownList,
	getIsUpdatingMasterList,
} from "reducers/master";
import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";
import { renderModalButtons } from "utils/renderModalButtons";
import { isRequired, lengthEquals, maxLength } from "utils/validations";

const formName = "transport";

const TransportForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
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
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={55}
							label="Transporter Name"
							name="name"
							placeholder="Enter Transporter Name"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={100}
							label="Address Line 1"
							name="address_1"
							placeholder="Enter Address Line 1"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={100}
							label="Address Line 2"
							name="address_2"
							placeholder="Enter Address Line 2"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={50}
							label="City"
							name="city"
							placeholder="Enter City"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="state"
							label="State"
							disabled={isFetchingDropdown || isViewOnly}
							options={stateOptions}
							touched={meta?.state?.touched}
							error={errors?.state}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Pincode"
							name="pincode"
							placeholder="Enter Pincode"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={50}
							type="email"
							label="Email"
							name="email"
							placeholder="Enter Email"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={30}
							label="Contact Person"
							name="contact_person"
							placeholder="Enter Contact Person"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Phone"
							name="phone"
							placeholder="Enter Phone"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={10}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Mobile"
							name="mobile"
							placeholder="Enter Mobile"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={15}
							label="GST Number"
							name="gstin"
							placeholder="Enter GST Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={10}
							label="PAN"
							name="pan"
							placeholder="Enter PAN"
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
	fields: [
		"name",
		"address_1",
		"address_2",
		"city",
		"state",
		"pincode",
		"email",
		"contact_person",
		"phone",
		"mobile",
		"gstin",
		"pan",
	],
	validate: values => {
		const errors = {};

		isRequired(values?.name) && (errors.name = "Required");
		isRequired(values?.address_1) && (errors.address_1 = "Required");
		isRequired(values?.city) && (errors.city = "Required");
		isRequired(values?.state) && (errors.state = "Required");
		isRequired(values?.pincode) && (errors.pincode = "Required");

		maxLength(values?.pincode, 6) &&
			(errors.pincode = "Pincode can be a maximum of 6 digits");
		maxLength(values?.phone, 15) &&
			(errors.pincode = "Phone can be a maximum of 15 digits");
		maxLength(values?.mobile, 10) &&
			(errors.mobile = "Mobile number can be a maximum of 10 digits");

		lengthEquals(values?.gstin, 15) &&
			(errors.gstin = "GST Number should be of 15 characters");
		lengthEquals(values?.pan, 10) &&
			(errors.pan = "PAN should be of 10 characters");

		return errors;
	},
})(TransportForm);
