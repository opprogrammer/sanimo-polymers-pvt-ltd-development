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
import {
	isPositiveInteger,
	isRequired,
	isValidWeightorRate,
} from "utils/validations";
import { gradeOptions } from "../Grn/grnConstants";
import {
	dyeingGradationOptions,
	qualityGradationOptions,
} from "../QualityCheck/qualityCheckConstants";
import {
	issueToDepartmentOptions,
	slipTypeOptions,
} from "./issueToDepartmentConstants";
import { renderItdPallet } from "./renderItdPallet";

const formName = "issueToDepartment";
const formSelector = formValueSelector(formName);

const IssueToDepartmentForm = ({
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
	const itdPallet = useSelector(state => formSelector(state, "itd_pallet"));
	const yarnQuality = useSelector(state =>
		formSelector(state, "yarn_quality_id")
	);
	const shadeNumber = useSelector(state => formSelector(state, "shade_no"));
	const grade = useSelector(state => formSelector(state, "grade"));
	const lotNumber = useSelector(state => formSelector(state, "lot_id"));
	const qualityGradation = useSelector(state =>
		formSelector(state, "quality_gradation")
	);
	const dyeingGradation = useSelector(state =>
		formSelector(state, "dyeing_gradation")
	);

	const updateItdPallet = useSelector(state =>
		formSelector(state, "update_itd_pallet")
	);

	const { userId } = useSelector(getUserDetails);
	const config = { headers: apiConfig?.getHeaders() };

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchQcPallet = (id, index) => {
		const query = {
			id,
			list_type: "qc_pallet",
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
					change(formName, `itd_pallet.[${index}].qc_pallet`, res?.data?.data)
				);
			});
	};

	useEffect(() => {
		let totalUsedCheese = 0;
		let totalUsedCartons = 0;
		let totalNetWeight = 0;

		itdPallet?.forEach(ip => {
			totalUsedCheese += +ip?.used_cheese || 0;
			totalUsedCartons += +ip?.used_cartons || 0;
			totalNetWeight += +ip?.used_net_weight || 0;
		});
		dispatch(change(formName, "total_cheese", totalUsedCheese));
		dispatch(change(formName, "total_cartons", totalUsedCartons));
		dispatch(change(formName, "total_net_weight", totalNetWeight.toFixed(4)));
	}, [dispatch, itdPallet]);

	const updateAvgWeight = (index, noOfCheese, netWeight) => {
		dispatch(
			change(
				formName,
				`itd_pallet.[${index}].used_average_weight`,
				(+netWeight / (+noOfCheese ? +noOfCheese : 1)).toFixed(4) || 0
			)
		);
	};

	useEffect(() => {
		if (meta?.itd_pallet && updateItdPallet === false)
			dispatch(change(formName, "update_itd_pallet", true));
	}, [meta?.itd_pallet, updateItdPallet, dispatch]);

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
								label="Slip Number"
								name="slip_no"
								placeholder="Enter Slip Number"
								disabled
							/>
						</Col>
					)}
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							label="Slip Date"
							name="slip_date"
							type="date"
							max="9999-12-31"
							placeholder="Enter Slip Date"
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
								itdPallet?.length ||
								isEditing
							}
							touched={meta?.yarn_quality_id?.touched}
							error={errors?.yarn_quality_id}
							placeholder="Quality Name"
							masterDropdownName="yarn-quality"
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
								itdPallet?.length ||
								isEditing
							}
							touched={meta?.lot_id?.touched}
							error={errors?.lot_id}
							placeholder="Enter Lot Number"
							masterDropdownName="lot"
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							name="shade_no"
							label="Shade Number"
							placeholder="Enter Shade Number"
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								itdPallet?.length ||
								isEditing
							}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="grade"
							label="Grade"
							options={gradeOptions}
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								itdPallet?.length ||
								isEditing
							}
							touched={meta?.grade?.touched}
							error={errors?.grade}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="quality_gradation"
							label="Quality Gradation"
							options={qualityGradationOptions}
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								itdPallet?.length ||
								isEditing
							}
							touched={meta?.quality_gradation?.touched}
							error={errors?.quality_gradation}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="dyeing_gradation"
							label="Dyeing Gradation"
							options={dyeingGradationOptions}
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								itdPallet?.length ||
								isEditing
							}
							touched={meta?.dyeing_gradation?.touched}
							error={errors?.dyeing_gradation}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="slip_type"
							label="Slip Type"
							options={slipTypeOptions}
							disabled={isFetchingDropdown || isViewOnly || isEditing}
							touched={meta?.slip_type?.touched}
							error={errors?.slip_type}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={50}
							label="Tint"
							name="tint"
							placeholder="Enter Tint"
							disabled={isFetchingDropdown || isViewOnly || isEditing}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={50}
							label="Trolley Number"
							name="trolley_no"
							placeholder="Enter Trolley Number"
							disabled={isFetchingDropdown || isViewOnly || isEditing}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={50}
							label="Checker Name"
							name="checker_name"
							placeholder="Enter Checker Name"
							disabled={isFetchingDropdown || isViewOnly || isEditing}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="issue_to_department"
							label="Issue To Department"
							options={issueToDepartmentOptions}
							disabled={isFetchingDropdown || isViewOnly || isEditing}
							touched={meta?.issue_to_department?.touched}
							error={errors?.issue_to_department}
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
							name="total_net_weight"
							label="Total Net Weight"
							placeholder="Enter Total Net Weight"
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
				<Row className="mt-3">
					<FieldArray
						name="itd_pallet"
						component={renderItdPallet}
						isViewOnly={isViewOnly}
						yarnQuality={yarnQuality}
						lotNumber={lotNumber}
						shadeNumber={shadeNumber}
						grade={grade}
						qualityGradation={qualityGradation}
						dyeingGradation={dyeingGradation}
						fetchQcPallet={fetchQcPallet}
						itdPallet={itdPallet}
						updateAvgWeight={updateAvgWeight}
						isEditing={isEditing}
						errorsData={errors}
						isFetchingDropdown={isFetchingDropdown}
						metaData={meta}
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

		isRequired(values?.slip_date) && (errors.slip_date = "Required");
		isRequired(values?.yarn_quality_id) &&
			(errors.yarn_quality_id = "Required");
		isRequired(values?.lot_id) && (errors.lot_id = "Required");
		isRequired(values?.shade_no) && (errors.shade_no = "Required");
		isRequired(values?.grade) && (errors.grade = "Required");
		isRequired(values?.quality_gradation) &&
			(errors.quality_gradation = "Required");
		isRequired(values?.issue_to_department) &&
			(errors.issue_to_department = "Required");
		isRequired(values?.slip_type) && (errors.slip_type = "Required");

		if (isRequired(values?.itd_pallet)) {
			errors.itd_pallet = {
				_error: "At least one QC Pallet entry must be present",
			};
		} else {
			const renderQcPalletErrors = [];

			values?.itd_pallet?.forEach((itdPallet, targetIndex) => {
				const referenceError = {};

				isRequired(itdPallet?.used_cheese) &&
					(referenceError.used_cheese = "Required");
				isRequired(itdPallet?.used_cartons) &&
					(referenceError.used_cartons = "Required");
				isRequired(itdPallet?.used_gross_weight) &&
					(referenceError.used_gross_weight = "Required");
				isRequired(itdPallet?.used_tare_weight) &&
					(referenceError.used_tare_weight = "Required");
				isRequired(itdPallet?.used_net_weight) &&
					(referenceError.used_net_weight = "Required");

				isPositiveInteger(+itdPallet?.used_cheese) &&
					(referenceError.used_cheese = "Enter valid number of cheese");
				isPositiveInteger(+itdPallet?.used_cartons) &&
					(referenceError.used_cartons = "Enter valid number of cartons");
				isValidWeightorRate(itdPallet?.used_gross_weight) &&
					(referenceError.used_gross_weight = "Enter valid gross weight");
				isValidWeightorRate(itdPallet?.used_tare_weight) &&
					(referenceError.used_tare_weight = "Enter valid tare weight");
				isValidWeightorRate(itdPallet?.used_net_weight) &&
					(referenceError.used_net_weight = "Enter valid net weight");

				if (
					itdPallet?.qc_pallet?.no_of_cheese +
						(+itdPallet?.existing_cheese || 0) <
					itdPallet?.used_cheese
				) {
					referenceError.used_cheese =
						"Used cheese should be less than or equal to available number of cheese";
				}

				if (
					itdPallet?.qc_pallet?.net_weight +
						(+itdPallet?.existing_net_weight || 0) <
					itdPallet?.used_net_weight
				) {
					referenceError.used_net_weight =
						"Used net weight should be less than or equal to available net weight";
				}

				renderQcPalletErrors[targetIndex] = referenceError;
			});

			if (renderQcPalletErrors.length) {
				errors.itd_pallet = renderQcPalletErrors;
			}
		}

		if (!values?.id) {
			let qcPalletList = {};
			values?.itd_pallet?.forEach(itd => {
				if (itd?.qc_pallet_id?.value) {
					if (itd?.qc_pallet_id?.value in qcPalletList) {
						errors.itd_pallet = {
							_error: "Duplicate QC Pallet selected",
						};
						return;
					} else {
						qcPalletList[itd?.qc_pallet_id?.value] = true;
					}
				}
			});
		}

		return errors;
	},
})(IssueToDepartmentForm);
