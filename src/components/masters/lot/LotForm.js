import { Col, Modal, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Field, getFormMeta, getFormSyncErrors, reduxForm } from "redux-form";

import {
	getIsFetchingDropdownList,
	getIsUpdatingMasterList,
} from "reducers/master";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { renderModalButtons } from "utils/renderModalButtons";
import { isRequired } from "utils/validations";
import { typeOfLotOptions } from "./lotConstants";

const formName = "lot";

const LotForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
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
							maxLength={25}
							label="Lot Number"
							name="lot_no"
							placeholder="Enter Lot Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="yarn_quality_id"
							label="Yarn Quality"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.yarn_quality_id?.touched}
							error={errors?.yarn_quality_id}
							placeholder="Select Quality"
							masterDropdownName="yarn-quality"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="base_manufacturer_id"
							label="Base Manufacturer"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.base_manufacturer_id?.touched}
							error={errors?.base_manufacturer_id}
							placeholder="Select Base Manufacturer"
							masterDropdownName="party"
							query={{ party_type: "vendor" }}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="jobber_id"
							label="Jobber"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.jobber_id?.touched}
							error={errors?.jobber_id}
							placeholder="Select Jobber"
							masterDropdownName="party"
							query={{ party_type: "vendor" }}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="type_of_lot"
							label="Lot Type"
							options={typeOfLotOptions}
							touched={meta?.type_of_lot?.touched}
							error={errors?.type_of_lot}
							disabled={isViewOnly}
							placeholder="Select Lot Type"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="parent_lot_id"
							label="Parent Lot"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.parent_lot_id?.touched}
							error={errors?.parent_lot_id}
							placeholder="Select Parent Lot"
							masterDropdownName="lot"
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
		"lot_no",
		"yarn_quality_id",
		"base_manufacturer_id",
		"jobber_id",
		"parent_lot_id",
		"type_of_lot",
	],
	validate: values => {
		const errors = {};

		isRequired(values?.lot_no) && (errors.lot_no = "Required");
		isRequired(values?.yarn_quality_id) &&
			(errors.yarn_quality_id = "Required");
		isRequired(values?.base_manufacturer_id) &&
			(errors.base_manufacturer_id = "Required");
		isRequired(values?.type_of_lot) && (errors.type_of_lot = "Required");

		if (values?.id === values?.parent_lot_id?.value) {
			errors.parent_lot_id = "Parent lot cannot be self";
		}

		return errors;
	},
})(LotForm);
