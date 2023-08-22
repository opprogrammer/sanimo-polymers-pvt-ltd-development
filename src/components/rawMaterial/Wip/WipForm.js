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

import { ReduxFormTextField } from "utils/ReduxFormTextField";

import apiConfig from "actions/apiConfig";
import axios from "axios";
import { useEffect } from "react";
import {
	getIsFetchingDropdownList,
	getIsUpdatingMasterList,
} from "reducers/master";
import { getUserDetails } from "reducers/user";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
import { onWheelHandler } from "utils/onWheelHandler";
import { renderModalButtons } from "utils/renderModalButtons";
import stringifyQueryParams from "utils/stringifyQueryParams";
import { isRequired } from "utils/validations";
import { gradeOptions } from "../Grn/grnConstants";
import { renderWipPalletForm } from "./renderWipPalletForm";
import { entryTypeOptions } from "./wipConstants";

const formName = "wipForm";
const formSelector = formValueSelector(formName);

const WipForm = ({
	title,
	onCancel,
	handleSubmit,
	isViewOnly,
	initialValues,
	isEditing,
}) => {
	const dispatch = useDispatch();

	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);
	const isFetchingDropdown = useSelector(getIsFetchingDropdownList);

	const meta = useSelector(getFormMeta(formName));
	const errors = useSelector(getFormSyncErrors(formName));
	const wipPallet = useSelector(state => formSelector(state, "wip_pallet"));
	const yarnQuality = useSelector(state =>
		formSelector(state, "yarn_quality_id")
	);
	const lotNumber = useSelector(state => formSelector(state, "lot_id"));
	const grade = useSelector(state => formSelector(state, "grade"));
	const shadeNumber = useSelector(state => formSelector(state, "shade_no"));
	const entryType = useSelector(state => formSelector(state, "entry_type"));

	const { userId } = useSelector(getUserDetails);

	const config = {
		headers: apiConfig?.getHeaders(),
	};

	const fetchPallet = (id, index, listType) => {
		const query = {
			id,
			list_type: listType,
		};

		axios
			.get(
				`${
					apiConfig?.baseURL
				}/v1/user/${userId}/stock/list?${stringifyQueryParams(query)}`,
				config
			)
			.then(res => {
				dispatch(
					change(
						formName,
						`wip_pallet.[${index}].pallet_entry`,
						res?.data?.data
					)
				);
			});
	};

	useEffect(() => {
		let totalCheese = 0;
		let totalCartons = 0;

		wipPallet?.forEach(wp => {
			totalCheese += +wp?.pallet_entry?.no_of_cheese || 0;
			totalCartons += +wp?.pallet_entry?.no_of_cartons || 0;
		});
		dispatch(change(formName, "total_cheese", totalCheese));
		dispatch(change(formName, "total_cartons", totalCartons));
	}, [dispatch, wipPallet]);

	return (
		<form onSubmit={handleSubmit}>
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Row>
					{initialValues?.id && (
						<Col className="mb-1">
							<Field
								component={ReduxFormTextField}
								maxLength={55}
								label="Entry Number"
								name="entry_no"
								placeholder="Enter entry Number"
								disabled
							/>
						</Col>
					)}
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							label="Entry Date"
							name="entry_date"
							type="date"
							max="9999-12-31"
							placeholder="Enter Entry Date"
							disabled={isViewOnly || isEditing}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="yarn_quality_id"
							label="Quality Name"
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								wipPallet?.length ||
								isEditing
							}
							touched={meta?.yarn_quality_id?.touched}
							error={errors?.yarn_quality_id}
							placeholder="Quality Name"
							masterDropdownName="yarn-quality"
							isSubForm={true}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="lot_id"
							label="Lot Number"
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								wipPallet?.length ||
								isEditing
							}
							touched={meta?.lot_id?.touched}
							error={errors?.lot_id}
							placeholder="Enter Lot Number"
							masterDropdownName="lot"
							isSubForm={true}
						/>
					</Col>
					<Col>
						<Field
							label="Shade Number"
							name="shade_no"
							component={ReduxFormTextField}
							maxLength={30}
							placeholder="Shade Number"
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								wipPallet?.length ||
								isEditing
							}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="grade"
							label="Grade"
							options={gradeOptions}
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								wipPallet?.length ||
								isEditing
							}
							touched={meta?.grade?.touched}
							error={errors?.grade}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="entry_type"
							label="Entry Type"
							options={entryTypeOptions}
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								wipPallet?.length ||
								isEditing
							}
							touched={meta?.grade?.touched}
							error={errors?.grade}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							name="total_cheese"
							label="Total Cheese"
							placeholder="Enter Total Cheese"
							disabled
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							name="total_cartons"
							label="Total Cartons"
							placeholder="Enter Total Cartons"
							disabled
						/>
					</Col>
				</Row>
				<Row className="mt-2">
					<FieldArray
						name="wip_pallet"
						component={renderWipPalletForm}
						isFetchingDropdown={isFetchingDropdown}
						errorsData={errors}
						metaData={meta}
						isViewOnly={isViewOnly}
						wipPallet={wipPallet}
						yarnQuality={yarnQuality}
						lotNumber={lotNumber}
						shadeNumber={shadeNumber}
						entryType={entryType}
						grade={grade}
						isEditing={isEditing}
						fetchPallet={fetchPallet}
					/>
				</Row>
			</Modal.Body>
			{renderModalButtons(onCancel, isUpdatingMaster || isViewOnly)}
		</form>
	);
};

export default reduxForm({
	form: formName,
	validate: values => {
		const errors = {};

		isRequired(values?.entry_date) && (errors.entry_date = "Required");
		isRequired(values?.yarn_quality_id) &&
			(errors.yarn_quality_id = "Required");
		isRequired(values?.lot_id) && (errors.lot_id = "Required");
		isRequired(values?.shade_no) && (errors.shade_no = "Required");
		isRequired(values?.grade) && (errors.grade = "Required");

		if (isRequired(values?.wip_pallet)) {
			errors.wip_pallet = {
				_error: "At least one Pallet entry must be present",
			};
		} else {
			const renderWipErrors = [];
			values?.wip_pallet?.forEach((wp, targetIndex) => {
				const referenceError = {};

				isRequired(wp?.entry_id) && (referenceError.entry_id = "Required");

				renderWipErrors[targetIndex] = referenceError;
			});
			if (renderWipErrors.length) {
				errors.wip_pallet = renderWipErrors;
			}

			if (!values?.id) {
				let palletList = {};
				values?.wip_pallet?.forEach(wp => {
					if (wp?.entry_id?.value) {
						if (wp?.entry_id?.value in palletList) {
							errors.wip_pallet = {
								_error: "Duplicate Pallets selected",
							};
							return;
						} else {
							palletList[wp?.entry_id?.value] = true;
						}
					}
				});
			}
		}

		return errors;
	},
})(WipForm);
