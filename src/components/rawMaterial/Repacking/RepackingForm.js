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
import { MdClose } from "react-icons/md";
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
import { renderGrnForm } from "./renderGrnForm";
import { renderRepackingPallet } from "./renderRepackingPallet";

const formName = "repacking";
const formSelector = formValueSelector(formName);

const RepackingForm = ({
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
	const repackedGrn = useSelector(state => formSelector(state, "repacked_grn"));
	const repackedPallet = useSelector(state =>
		formSelector(state, "repacked_pallet")
	);
	const yarnQuality = useSelector(state =>
		formSelector(state, "yarn_quality_id")
	);
	const lotNumber = useSelector(state => formSelector(state, "lot_id"));
	const grade = useSelector(state => formSelector(state, "grade"));
	const shadeNumber = useSelector(state => formSelector(state, "shade_no"));

	const { userId } = useSelector(getUserDetails);

	const config = {
		headers: apiConfig?.getHeaders(),
	};

	const fetchShadeList = (id, index, master) => {
		const query = {
			id,
		};

		axios
			.get(
				`${
					apiConfig?.baseURL
				}/v1/user/${userId}/${master}/list?${stringifyQueryParams(query)}`,
				config
			)
			.then(res => {
				dispatch(
					change(
						formName,
						`repacked_grn.[${index}].shade_entry`,
						res?.data?.data?.shade_entry
					)
				);
				dispatch(
					change(
						formName,
						`repacked_grn.[${index}].total_cheese`,
						res?.data?.data?.total_cheese
					)
				);
				dispatch(
					change(
						formName,
						`repacked_grn.[${index}].total_cartons`,
						res?.data?.data?.total_cartons
					)
				);
				dispatch(
					change(
						formName,
						`repacked_grn.[${index}].total_net_weight`,
						res?.data?.data?.total_net_weight
					)
				);
			});
	};

	useEffect(() => {
		let totalCheese = 0;
		let totalCartons = 0;
		let totalNetWeight = 0;
		repackedPallet?.forEach(rp => {
			totalCartons += +rp?.no_of_cartons || 0;
		});
		repackedGrn?.forEach(rg => {
			totalCheese += +rg?.total_cheese || 0;
			totalNetWeight += +rg?.total_net_weight || 0;
		});
		dispatch(change(formName, "total_cheese", totalCheese));
		dispatch(change(formName, "total_cartons", totalCartons));
		dispatch(change(formName, "total_net_weight", totalNetWeight.toFixed(4)));
	}, [dispatch, repackedPallet, repackedGrn]);

	const updateAvgWeight = (index, noOfCheese, netWeight) => {
		dispatch(
			change(
				formName,
				`repacked_pallet.[${index}].average_weight`,
				(+netWeight / (+noOfCheese ? +noOfCheese : 1)).toFixed(4) || 0
			)
		);
	};

	const updateRepackedPallet = useSelector(state =>
		formSelector(state, "update_repacked_pallet")
	);

	useEffect(() => {
		if (meta?.repacked_pallet && updateRepackedPallet === false)
			dispatch(change(formName, "update_repacked_pallet", true));
	}, [meta?.repacked_pallet, updateRepackedPallet, dispatch]);

	return (
		<form onSubmit={handleSubmit}>
			<div className="d-flex justify-content-between">
				{title && <h3 style={{ textTransform: "capitalize" }}>{title}</h3>}
				<button className="btn" type="button" onClick={onCancel}>
					<MdClose className="me-1 fs-4" />
				</button>
			</div>
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
								repackedGrn?.length ||
								repackedPallet?.length ||
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
								repackedGrn?.length ||
								repackedPallet?.length ||
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
								repackedGrn?.length ||
								repackedPallet?.length ||
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
								repackedGrn?.length ||
								repackedPallet?.length ||
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
				</Row>
				<Row className="mt-2">
					<FieldArray
						name="repacked_grn"
						component={renderGrnForm}
						isFetchingDropdown={isFetchingDropdown}
						errorsData={errors}
						metaData={meta}
						isViewOnly={isViewOnly}
						repackedGrn={repackedGrn}
						yarnQuality={yarnQuality}
						lotNumber={lotNumber}
						shadeNumber={shadeNumber}
						grade={grade}
						fetchShadeList={fetchShadeList}
						isEditing={isEditing}
					/>
				</Row>
				<Row className="mt-2">
					<FieldArray
						name="repacked_pallet"
						component={renderRepackingPallet}
						isFetchingDropdown={isFetchingDropdown}
						isViewOnly={isViewOnly}
						errorsData={errors}
						metaData={meta}
						disableRepackButton={
							!yarnQuality || !lotNumber || !grade || !shadeNumber
						}
						repackedPallet={repackedPallet}
						updateAvgWeight={updateAvgWeight}
						isEditing={isEditing}
					/>
				</Row>
			
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

		if (isRequired(values?.repacked_grn)) {
			errors.repacked_grn = {
				_error: "At least one GRN entry must be present",
			};
		} else {
			const renderGrnErrors = [];
			values?.repacked_grn?.forEach((grn, targetIndex) => {
				const referenceError = {};

				isRequired(grn?.grn_no) && (referenceError.grn_no = "Required");

				renderGrnErrors[targetIndex] = referenceError;
			});
			if (renderGrnErrors.length) {
				errors.repacked_grn = renderGrnErrors;
			}
			if (!values?.id) {
				let grnList = {};
				values?.repacked_grn?.forEach(rg => {
					if (rg?.grn_no?.value) {
						if (rg?.grn_no?.value in grnList) {
							errors.repacked_grn = {
								_error: "Duplicate GRN Number selected",
							};
							return;
						} else {
							grnList[rg?.grn_no?.value] = true;
						}
					}
				});
			}
		}

		if (isRequired(values?.repacked_pallet)) {
			errors.repacked_pallet = {
				_error: "At least one Repacked Pallet entry must be present",
			};
		} else {
			const renderRepackedPalletErrors = [];

			values?.repacked_pallet?.forEach((repackedPallet, targetIndex) => {
				const referenceError = {};

				isRequired(repackedPallet?.no_of_cheese) &&
					(referenceError.no_of_cheese = "Required");
				isRequired(repackedPallet?.no_of_cartons) &&
					(referenceError.no_of_cartons = "Required");
				isRequired(repackedPallet?.gross_weight) &&
					(referenceError.gross_weight = "Required");
				isRequired(repackedPallet?.tare_weight) &&
					(referenceError.tare_weight = "Required");
				isRequired(repackedPallet?.net_weight) &&
					(referenceError.net_weight = "Required");

				isPositiveInteger(+repackedPallet?.no_of_cheese) &&
					(referenceError.no_of_cheese = "Enter valid number of cheese");
				isPositiveInteger(+repackedPallet?.no_of_cartons) &&
					(referenceError.no_of_cartons = "Enter valid number of cartons");
				isValidWeightorRate(repackedPallet?.gross_weight) &&
					(referenceError.gross_weight = "Enter valid gross weight");
				isValidWeightorRate(repackedPallet?.tare_weight) &&
					(referenceError.tare_weight = "Enter valid tare weight");
				isValidWeightorRate(repackedPallet?.net_weight) &&
					(referenceError.net_weight = "Enter valid tare weight");

				renderRepackedPalletErrors[targetIndex] = referenceError;
			});

			if (renderRepackedPalletErrors.length) {
				errors.repacked_pallet = renderRepackedPalletErrors;
			}

			let repackedCheese = 0;
			let repackedNetWeight = 0;
			values?.repacked_pallet?.forEach(rp => {
				repackedCheese += +rp?.no_of_cheese;
				repackedNetWeight += +rp?.net_weight;
			});
			if (
				repackedCheese &&
				values?.total_cheese &&
				+repackedCheese !== +values?.total_cheese
			) {
				errors.repacked_pallet = {
					_error: "Total repacked cheese should be equal to total cheese",
				};
			}
			if (
				repackedNetWeight &&
				values?.total_net_weight &&
				+repackedNetWeight.toFixed(4) !== +values?.total_net_weight
			) {
				errors.repacked_pallet = {
					_error:
						"Total repacked net weight should be equal to total net weight",
				};
			}
		}

		return errors;
	},
})(RepackingForm);
