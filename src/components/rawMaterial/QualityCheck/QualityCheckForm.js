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
import debounce from "lodash-es/debounce";
import { useCallback, useEffect } from "react";
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
import { renderQcPallet } from "./renderQcPallet";

const formName = "qualityCheck";
const formSelector = formValueSelector(formName);

const QualityCheckForm = ({
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
	const qcPallet = useSelector(state => formSelector(state, "qc_pallet"));
	const yarnQuality = useSelector(state =>
		formSelector(state, "yarn_quality_id")
	);
	const shadeNumber = useSelector(state => formSelector(state, "shade_no"));
	const grade = useSelector(state => formSelector(state, "grade"));
	const lotNumber = useSelector(state => formSelector(state, "lot_id"));
	const wipStock = useSelector(state => formSelector(state, "wip_stock"));

	const updateQcPallet = useSelector(state =>
		formSelector(state, "update_qc_pallet")
	);

	const { userId } = useSelector(getUserDetails);
	const config = { headers: apiConfig?.getHeaders() };

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchWipStock = useCallback(
		debounce((yarnQuality, lotNumber, shadeNumber, grade) => {
			const queryString = stringifyQueryParams({
				yarn_quality_id: yarnQuality?.value,
				lot_id: lotNumber?.value,
				shade: shadeNumber,
				grade: grade,
				list_type: "wip_stock",
			});

			axios
				.get(
					`${apiConfig?.baseURL}/v1/user/${userId}/stock/list?${queryString}`,
					config
				)
				.then(res => {
					dispatch(
						change(
							formName,
							"wip_stock",
							res?.data?.data?.results?.length
								? res?.data?.data?.results
								: [
										{
											average_weight: 0,
											net_weight: 0,
											no_of_cheese: 0,
											no_of_cartons: 0,
										},
								  ]
						)
					);
				});
		}, 1000),
		[]
	);

	useEffect(() => {
		if (yarnQuality && grade && shadeNumber && lotNumber) {
			fetchWipStock(yarnQuality, lotNumber, shadeNumber, grade);
		}
	}, [yarnQuality, grade, shadeNumber, lotNumber, fetchWipStock]);

	useEffect(() => {
		let totalUsedCheese = 0;
		let totalUsedCartons = 0;
		let totalNetWeight = 0;
		qcPallet?.forEach(rqp => {
			totalUsedCheese += +rqp?.no_of_cheese || 0;
			totalUsedCartons += +rqp?.no_of_cartons || 0;
			totalNetWeight += +rqp?.net_weight || 0;
		});
		dispatch(change(formName, "total_cheese", totalUsedCheese));
		dispatch(change(formName, "total_cartons", totalUsedCartons));
		dispatch(change(formName, "total_net_weight", totalNetWeight.toFixed(4)));
	}, [dispatch, qcPallet]);

	const updateAvgWeight = (index, noOfCheese, netWeight) => {
		dispatch(
			change(
				formName,
				`qc_pallet.[${index}].average_weight`,
				(+netWeight / (+noOfCheese ? +noOfCheese : 1)).toFixed(4) || 0
			)
		);
	};

	useEffect(() => {
		if (meta?.qc_pallet && updateQcPallet === false)
			dispatch(change(formName, "update_qc_pallet", true));
	}, [meta?.qc_pallet, updateQcPallet, dispatch]);

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
								qcPallet?.length ||
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
								qcPallet?.length ||
								isEditing
							}
							touched={meta?.lot_id?.touched}
							error={errors?.lot_id}
							placeholder="Enter Lot Number"
							masterDropdownName="lot"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							name="shade_no"
							label="Shade Number"
							placeholder="Enter Shade Number"
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								qcPallet?.length ||
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
								qcPallet?.length ||
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
						name="qc_pallet"
						component={renderQcPallet}
						isViewOnly={isViewOnly}
						disableQcButton={
							!yarnQuality || !lotNumber || !shadeNumber || !grade
						}
						qcPallet={qcPallet}
						wipStock={wipStock}
						updateAvgWeight={updateAvgWeight}
						isEditing={isEditing}
						errorsData={errors}
						isFetchingDropdown={isFetchingDropdown}
						metaData={meta}
					/>
				</Row>
				<Field component="input" name="existing_cheese" hidden />
				<Field component="input" name="existing_net_weight" hidden />
				<FieldArray component="input" name="wip_stock" hidden />
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

		if (isRequired(values?.qc_pallet)) {
			errors.qc_pallet = {
				_error: "At least one QC Pallet entry must be present",
			};
		} else {
			const renderQcPalletErrors = [];

			values?.qc_pallet?.forEach((qcPallet, targetIndex) => {
				const referenceError = {};

				isRequired(qcPallet?.quality_gradation) &&
					(referenceError.quality_gradation = "Required");
				isRequired(qcPallet?.no_of_cheese) &&
					(referenceError.no_of_cheese = "Required");
				isRequired(qcPallet?.no_of_cartons) &&
					(referenceError.no_of_cartons = "Required");
				isRequired(qcPallet?.gross_weight) &&
					(referenceError.gross_weight = "Required");
				isRequired(qcPallet?.tare_weight) &&
					(referenceError.tare_weight = "Required");
				isRequired(qcPallet?.net_weight) &&
					(referenceError.net_weight = "Required");
				isRequired(qcPallet?.location_id) &&
					(referenceError.location_id = "Required");

				isPositiveInteger(+qcPallet?.no_of_cheese) &&
					(referenceError.no_of_cheese = "Enter valid number of cheese");
				isPositiveInteger(+qcPallet?.no_of_cartons) &&
					(referenceError.no_of_cartons = "Enter valid number of cartons");
				isValidWeightorRate(qcPallet?.gross_weight) &&
					(referenceError.gross_weight = "Enter valid gross weight");
				isValidWeightorRate(qcPallet?.tare_weight) &&
					(referenceError.tare_weight = "Enter valid tare weight");
				isValidWeightorRate(qcPallet?.net_weight) &&
					(referenceError.net_weight = "Enter valid net weight");

				renderQcPalletErrors[targetIndex] = referenceError;
			});

			if (renderQcPalletErrors.length) {
				errors.qc_pallet = renderQcPalletErrors;
			}

			if (
				+values?.wip_stock?.[0]?.no_of_cheese + +values?.existing_cheese <
				+values?.total_cheese
			) {
				errors.qc_pallet = {
					_error:
						"Total number of cheese should not be greater than cheese in WIP stock",
				};
			}

			if (
				+values?.wip_stock?.[0]?.net_weight + +values?.existing_net_weight <
				+values?.total_net_weight
			) {
				errors.qc_pallet = {
					_error:
						"Total net weight should not be greater than net weight in WIP stock",
				};
			}
		}

		return errors;
	},
})(QualityCheckForm);
