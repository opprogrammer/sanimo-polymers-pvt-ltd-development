import { useEffect } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
	Field,
	FieldArray,
	change,
	formValueSelector,
	getFormMeta,
	getFormSyncErrors,
	reduxForm,
} from "redux-form";

import { stateOptions } from "constants/master";
import {
	getIsFetchingDropdownList,
	getIsUpdatingMasterList,
} from "reducers/master";
import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { renderModalButtons } from "utils/renderModalButtons";

import { onWheelHandler } from "utils/onWheelHandler";
import {
	isPositiveInteger,
	isRequired,
	lengthEquals,
	maxLength,
} from "utils/validations";
import { partyTypeOptions, taxCategoryOptions } from "./partyConstants";
import { renderPartyDelivery } from "./renderPartyDelivery";

const formName = "party";
const formSelector = formValueSelector(formName);

const PartyForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
	const dispatch = useDispatch();

	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);
	const isFetchingDropdown = useSelector(getIsFetchingDropdownList);

	const updateDelivery = useSelector(state =>
		formSelector(state, "update_delivery")
	);
	const meta = useSelector(getFormMeta(formName));
	const errors = useSelector(getFormSyncErrors(formName));

	useEffect(() => {
		if (meta?.delivery && updateDelivery === false)
			dispatch(change(formName, "update_delivery", true));
	}, [meta?.delivery, updateDelivery, dispatch]);

	return (
		<form onSubmit={handleSubmit}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="party_type"
							label="Party Type"
							options={partyTypeOptions}
							touched={meta?.party_type?.touched}
							error={errors?.party_type}
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={55}
							label="Party Name"
							name="name"
							placeholder="Enter Party Name"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={100}
							label="Billing Address Line 1"
							name="billing_address_1"
							placeholder="Enter Billing Address Line 1"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={100}
							label="Billing Address Line 2"
							name="billing_address_2"
							placeholder="Enter Billing Address Line 2"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={50}
							label="Billing City"
							name="billing_city"
							placeholder="Enter Billing City"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="billing_state"
							label="Billing State"
							options={stateOptions}
							disabled={isViewOnly}
							touched={meta?.billing_state?.touched}
							error={errors?.billing_state}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Billing Pincode"
							name="billing_pincode"
							placeholder="Enter Billing Pincode"
							disabled={isViewOnly}
						/>
					</Col>
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
							maxLength={15}
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
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="tax_category"
							label="Tax Category"
							options={taxCategoryOptions}
							disabled={isViewOnly}
							touched={meta?.tax_category?.touched}
							error={errors?.tax_category}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Aadhar"
							name="aadhar"
							placeholder="Enter Aadhar"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={55}
							label="Broker Name"
							name="broker_name"
							placeholder="Enter Broker Name"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Broker Contact"
							name="broker_contact"
							placeholder="Enter Broker Contact"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={10}
							label="Broker PAN"
							name="broker_pan"
							placeholder="Enter Broker PAN"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Broker Aadhar"
							name="broker_aadhar"
							placeholder="Enter Broker Aadhar"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							type="number"
							component={ReduxFormTextField}
							min={0}
							max={100}
							step={1}
							label="Broker Percentage"
							name="broker_percentage"
							placeholder="Enter Broker Percentage"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							type="number"
							component={ReduxFormTextField}
							step={1}
							min={0}
							max={100}
							label="Small Batch Tolerance"
							name="small_batch_tolerance"
							placeholder="Enter Small Batch Tolerance"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							type="number"
							component={ReduxFormTextField}
							min={0}
							step={1}
							label="Small Batch Max Weight"
							name="small_batch_max_weight"
							placeholder="Enter Small Batch Max Weight"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							type="number"
							component={ReduxFormTextField}
							min={0}
							max={100}
							step={0.01}
							label="Big Batch Tolerance"
							name="big_batch_tolerance"
							placeholder="Enter Big Batch Tolerance"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							type="number"
							component={ReduxFormTextField}
							min={0}
							step={1}
							label="Big Batch Max Weight"
							name="big_batch_max_weight"
							placeholder="Enter Big Batch Max Weight"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
				<Row className="mt-3">
					<FieldArray
						name="delivery"
						component={renderPartyDelivery}
						isFetchingDropdown={isFetchingDropdown}
						errors={errors}
						meta={meta}
						isViewOnly={isViewOnly}
					/>
				</Row>
			</Modal.Body>
			{renderModalButtons(onCancel, isUpdatingMaster || isViewOnly)}
		</form>
	);
};

export default reduxForm({
	form: formName,
	fields: [
		"party_type",
		"name",
		"billing_address_1",
		"billing_address_2",
		"billing_city",
		"billing_state",
		"billing_pincode",
		"email",
		"contact_person",
		"phone",
		"mobile",
		"gstin",
		"pan",
		"aadhar",
		"broker_name",
		"broker_contact",
		"broker_pan",
		"broker_aadhar",
		"broker_percentage",
		"small_batch_tolerance",
		"small_batch_max_weight",
		"big_batch_tolerance",
		"big_batch_max_weight",
	],
	validate: values => {
		const errors = {};

		isRequired(values?.party_type) && (errors.party_type = "Required");
		isRequired(values?.name) && (errors.name = "Required");
		isRequired(values?.billing_address_1) &&
			(errors.billing_address_1 = "Required");
		isRequired(values?.billing_city) && (errors.billing_city = "Required");
		isRequired(values?.billing_state) && (errors.billing_state = "Required");
		isRequired(values?.billing_pincode) &&
			(errors.billing_pincode = "Required");

		maxLength(values?.billing_pincode, 6) &&
			(errors.billing_pincode = "Pincode can be of maximum of 6 digits");
		maxLength(values?.mobile, 10) &&
			(errors.mobile = "Mobile number should be not more than 10 characters");
		maxLength(values?.broker_contact, 10) &&
			(errors.broker_contact =
				"Contact number should be not more than 10 characters");

		isPositiveInteger(+values?.billing_pincode) &&
			(errors.billing_pincode = "Pincode should be a valid integer");

		lengthEquals(values?.gstin, 15) &&
			(errors.gstin = "GST Number should be of 15 characters");
		lengthEquals(values?.pan, 10) &&
			(errors.pan = "PAN should be of 10 characters");
		lengthEquals(values?.broker_pan, 10) &&
			(errors.broker_pan = "PAN should be of 10 characters");
		lengthEquals(values?.aadhar, 12) &&
			(errors.aadhar = "Aadhar should be of 12 characters");
		lengthEquals(values?.broker_aadhar, 12) &&
			(errors.broker_aadhar = "Aadhar should be of 12 characters");

		const deliveryErrors = [];
		values?.delivery?.forEach((partyDel, targetIndex) => {
			const partyDeliveryError = {};

			isRequired(partyDel?.address_1) &&
				(partyDeliveryError.address_1 = "Required");
			isRequired(partyDel?.city) && (partyDeliveryError.city = "Required");
			isRequired(partyDel?.state) && (partyDeliveryError.state = "Required");
			isRequired(partyDel?.pincode) &&
				(partyDeliveryError.pincode = "Required");

			maxLength(partyDel.pincode, 6) &&
				(partyDeliveryError.pincode = "Pincode can be of maximum of 6 digits");
			isPositiveInteger(+partyDel.pincode) &&
				(partyDeliveryError.pincode = "Pincode should be a valid integer");

			deliveryErrors[targetIndex] = partyDeliveryError;
		});
		if (deliveryErrors.length) {
			errors.delivery = deliveryErrors;
		}

		return errors;
	},
})(PartyForm);
