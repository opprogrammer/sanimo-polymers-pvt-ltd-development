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

import {
	getIsFetchingDropdownList,
	getIsUpdatingMasterList,
} from "reducers/master";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { renderModalButtons } from "utils/renderModalButtons";
import { isRequired } from "utils/validations";
import { renderPartyShadeReference } from "./renderPartyShadeReference";

const formName = "shade";
const formSelector = formValueSelector(formName);

const ShadeForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
	const dispatch = useDispatch();

	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);
	const isFetchingDropdown = useSelector(getIsFetchingDropdownList);
	const meta = useSelector(getFormMeta(formName));
	const errors = useSelector(getFormSyncErrors(formName));
	const updateYarnQuality = useSelector(state =>
		formSelector(state, "update_yarn_quality")
	);

	useEffect(() => {
		if (meta?.yarn_quality && updateYarnQuality === false)
			dispatch(change(formName, "update_yarn_quality", true));
	}, [meta?.yarn_quality, updateYarnQuality, dispatch]);

	const updatePartyShadeReferenceNumber = useSelector(state =>
		formSelector(state, "update_party_shade_reference_no")
	);

	useEffect(() => {
		if (
			meta?.party_shade_reference_no &&
			updatePartyShadeReferenceNumber === false
		)
			dispatch(change(formName, "update_party_shade_reference_no", true));
	}, [
		meta?.party_shade_reference_no,
		updatePartyShadeReferenceNumber,
		dispatch,
	]);

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
							maxLength={25}
							label="Shade Number"
							name="shade_no"
							placeholder="Enter Shade Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-2">
						<Field
							component={ReduxFormAsyncSelect}
							name="yarn_quality"
							label="Quality Name"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.yarn_quality?.touched}
							error={errors?.yarn_quality}
							masterDropdownName="yarn-quality"
							placeholder="Quality Name"
							isMulti
						/>
					</Col>
				</Row>
				<Row className="mt-3">
					<FieldArray
						name="party_shade_reference_no"
						component={renderPartyShadeReference}
						isFetchingDropdown={isFetchingDropdown}
						errorsData={errors}
						metaData={meta}
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
	fields: ["shade_no", "yarn_quality"],
	validate: values => {
		const errors = {};

		isRequired(values?.shade_no) && (errors.shade_no = "Required");
		isRequired(values?.yarn_quality) && (errors.yarn_quality = "Required");

		const partyShadeReferenceErrors = [];
		values?.party_shade_reference_no?.forEach((partyShade, targetIndex) => {
			const referenceError = {};

			isRequired(partyShade.party_id) && (referenceError.party_id = "Required");
			isRequired(partyShade.party_shade_reference) &&
				(referenceError.party_shade_reference = "Required");

			partyShadeReferenceErrors[targetIndex] = referenceError;
		});
		if (partyShadeReferenceErrors.length) {
			errors.party_shade_reference_no = partyShadeReferenceErrors;
		}

		let shadeReferenceList = {};
		values?.party_shade_reference_no?.forEach(psr => {
			if (psr?.party_id?.value) {
				if (psr?.party_id?.value in shadeReferenceList) {
					errors.party_shade_reference_no = {
						_error: "Duplicate Party Name selected",
					};
					return;
				} else {
					shadeReferenceList[psr?.party_id?.value] = true;
				}
			}
		});

		return errors;
	},
})(ShadeForm);
