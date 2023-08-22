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

import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
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
	outwardStockFromOptions,
	outwardTypeOptions,
} from "./outwardConstants";
import { renderOutwardStock } from "./renderOutwardStock";

const formName = "outward";
const formSelector = formValueSelector(formName);

const OutwardForm = ({
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

	const outwardQuantity = useSelector(state =>
		formSelector(state, "outward_quantity")
	);
	const yarnQuality = useSelector(state =>
		formSelector(state, "yarn_quality_id")
	);
	const lotNumber = useSelector(state => formSelector(state, "lot_id"));
	const grade = useSelector(state => formSelector(state, "grade"));
	const shadeNumber = useSelector(state => formSelector(state, "shade_no"));

	const updateOutwardQuantity = useSelector(state =>
		formSelector(state, "update_outward_quantity")
	);
	const outwardStockFrom = useSelector(state =>
		formSelector(state, "outward_stock_from")
	);
	const rate = useSelector(state => formSelector(state, "rate"));
	const totalCheese = useSelector(state => formSelector(state, "total_cheese"));

	useEffect(() => {
		dispatch(
			change(formName, `total_amount`, (+totalCheese * +rate).toFixed(4) || 0)
		);
	}, [totalCheese, rate, dispatch]);

	const updateAvgWeight = (index, noOfCheese, netWeight) => {
		dispatch(
			change(
				formName,
				`outward_quantity.[${index}].used_average_weight`,
				(+netWeight / (+noOfCheese ? +noOfCheese : 1)).toFixed(4) || 0
			)
		);
	};

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
						`outward_quantity.[${index}].shade_entry`,
						res?.data?.data?.shade_entry
					)
				);
				dispatch(
					change(
						formName,
						`outward_quantity.[${index}].total_cheese`,
						res?.data?.data?.total_cheese
					)
				);
				dispatch(
					change(
						formName,
						`outward_quantity.[${index}].total_cartons`,
						res?.data?.data?.total_cartons
					)
				);
				dispatch(
					change(
						formName,
						`outward_quantity.[${index}].net_weight`,
						res?.data?.data?.total_net_weight
					)
				);
			});
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
						`outward_quantity.[${index}].pallet_entry`,
						res?.data?.data
					)
				);
				dispatch(
					change(
						formName,
						`outward_quantity.[${index}].total_cheese`,
						res?.data?.data?.no_of_cheese
					)
				);
				dispatch(
					change(
						formName,
						`outward_quantity.[${index}].total_cartons`,
						res?.data?.data?.no_of_cartons
					)
				);
				dispatch(
					change(
						formName,
						`outward_quantity.[${index}].net_weight`,
						res?.data?.data?.net_weight
					)
				);
				dispatch(
					change(
						formName,
						`outward_quantity.[${index}].original_no_of_cheese`,
						res?.data?.data?.original_no_of_cheese
					)
				);
				dispatch(
					change(
						formName,
						`outward_quantity.[${index}].original_net_weight`,
						res?.data?.data?.original_net_weight
					)
				);
			});
	};

	useEffect(() => {
		let totalCheese = 0;
		let totalCartons = 0;
		let totalNetWeight = 0;
		if (outwardStockFrom === "QC") {
			outwardQuantity?.forEach(oq => {
				totalCheese += +oq?.used_cheese || 0;
				totalCartons += +oq?.used_cartons || 0;
				totalNetWeight += +oq?.used_net_weight || 0;
			});
		} else {
			outwardQuantity?.forEach(oq => {
				totalCheese += +oq?.total_cheese || 0;
				totalCartons += +oq?.total_cartons || 0;
				totalNetWeight += +oq?.net_weight || 0;
			});
		}
		dispatch(change(formName, "total_cheese", totalCheese));
		dispatch(change(formName, "total_cartons", totalCartons));
		dispatch(change(formName, "total_net_weight", totalNetWeight.toFixed(4)));
	}, [dispatch, outwardQuantity, outwardStockFrom]);

	useEffect(() => {
		if (meta?.outward_quantity && updateOutwardQuantity === false)
			dispatch(change(formName, "update_outward_quantity", true));
	}, [meta?.outward_quantity, updateOutwardQuantity, dispatch]);

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
								label="Outward Number"
								name="outward_no"
								placeholder="Enter Outward Number"
								disabled
							/>
						</Col>
					)}
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							label="Outward Date"
							name="outward_date"
							type="date"
							max="9999-12-31"
							placeholder="Enter Outward Date"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="outward_type"
							label="Outward Type"
							options={outwardTypeOptions}
							disabled={isViewOnly}
							touched={meta?.outward_type?.touched}
							error={errors?.outward_type}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="transport_id"
							label="Transporter"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.transport_id?.touched}
							error={errors?.transport_id}
							placeholder="Transport"
							masterDropdownName="transport"
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={25}
							label="Vehicle Number"
							name="vehicle_no"
							placeholder="Enter Vehicle Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={40}
							label="Security Outward Number"
							name="security_outward_no"
							placeholder="Enter Security Outward Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="date"
							max="9999-12-31"
							label="Security Outward Date"
							name="security_outward_date"
							placeholder="Enter Security Outward Date"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="party_id"
							label="Party Name"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.party_id?.touched}
							error={errors?.party_id}
							masterDropdownName="party"
							placeholder="Party Name"
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							maxLength={20}
							label="Challan Number"
							name="challan_no"
							placeholder="Enter Challan Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="date"
							max="9999-12-31"
							label="Challan Date"
							name="challan_date"
							placeholder="Enter Challan Date"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="outward_stock_from"
							label="Outward Stock From"
							options={outwardStockFromOptions}
							disabled={isViewOnly || isEditing || outwardQuantity?.length}
							touched={meta?.outward_stock_from?.touched}
							error={errors?.outward_stock_from}
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="lot_id"
							label="Lot Number"
							disabled={
								isFetchingDropdown ||
								isViewOnly ||
								isEditing ||
								outwardQuantity?.length
							}
							touched={meta?.lot_id?.touched}
							error={errors?.lot_id}
							placeholder="Enter Lot Number"
							masterDropdownName="lot"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							label="Shade Number"
							name="shade_no"
							component={ReduxFormTextField}
							maxLength={30}
							placeholder="Shade Number"
							disabled={isViewOnly || isEditing || outwardQuantity?.length}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="grade"
							label="Grade"
							options={gradeOptions}
							disabled={isViewOnly || isEditing || outwardQuantity?.length}
							touched={meta?.grade?.touched}
							error={errors?.grade}
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
								isEditing ||
								outwardQuantity?.length
							}
							touched={meta?.yarn_quality_id?.touched}
							error={errors?.yarn_quality_id}
							placeholder="Quality Name"
							masterDropdownName="yarn-quality"
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Total Cheese"
							name="total_cheese"
							placeholder="Enter Total Cheese"
							disabled
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Total Carton"
							name="total_cartons"
							placeholder="Enter Total Carton"
							disabled
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Total Net Weight"
							name="total_net_weight"
							placeholder="Enter Total Net Weight"
							disabled
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Rate"
							name="rate"
							placeholder="Rate"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Total Amount"
							name="total_amount"
							placeholder="Enter Total Amount"
							disabled
						/>
					</Col>
				</Row>
				<Row className="mt-2">
					<FieldArray
						name="outward_quantity"
						component={renderOutwardStock}
						fetchShadeList={fetchShadeList}
						fetchPallet={fetchPallet}
						updateAvgWeight={updateAvgWeight}
						isFetchingDropdown={isFetchingDropdown}
						outwardStockFrom={outwardStockFrom}
						outwardQuantity={outwardQuantity}
						yarnQuality={yarnQuality}
						lotNumber={lotNumber}
						shadeNumber={shadeNumber}
						grade={grade}
						errorsData={errors}
						metaData={meta}
						isEditing={isEditing}
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
	validate: values => {
		const errors = {};

		isRequired(values?.outward_type) && (errors.outward_type = "Required");
		isRequired(values?.party_id) && (errors.party_id = "Required");
		isRequired(values?.lot_id) && (errors.lot_id = "Required");
		isRequired(values?.shade_no) && (errors.shade_no = "Required");
		isRequired(values?.grade) && (errors.grade = "Required");
		isRequired(values?.yarn_quality_id) &&
			(errors.yarn_quality_id = "Required");
		isRequired(values?.outward_stock_from) &&
			(errors.outward_stock_from = "Required");
		isRequired(values?.rate) && (errors.rate = "Required");

		isValidWeightorRate(values?.rate) && (errors.rate = "Enter a valid rate");

		if (!values?.outward_quantity || values?.outward_quantity?.length === 0) {
			errors.outward_quantity = {
				_error: "Atleast one outward entry is required",
			};
		} else {
			const outwardErrors = [];
			values?.outward_quantity?.forEach((outwardEntry, targetIndex) => {
				const outwardEntryErrors = {};

				isRequired(outwardEntry?.used_cheese) &&
					(outwardEntryErrors.used_cheese = "Required");
				isRequired(outwardEntry?.used_cartons) &&
					(outwardEntryErrors.used_cartons = "Required");
				isRequired(outwardEntry?.used_gross_weight) &&
					(outwardEntryErrors.used_gross_weight = "Required");
				isRequired(outwardEntry?.used_tare_weight) &&
					(outwardEntryErrors.used_tare_weight = "Required");
				isRequired(outwardEntry?.used_net_weight) &&
					(outwardEntryErrors.used_net_weight = "Required");

				isPositiveInteger(+outwardEntry?.used_cheese) &&
					(outwardEntryErrors.used_cheese =
						"Number of Used Cheese should be a positive integer");

				isPositiveInteger(+outwardEntry?.used_cartons) &&
					(outwardEntryErrors.used_cartons =
						"Number of Used Cartons should be a positive integer");

				isValidWeightorRate(outwardEntry?.used_gross_weight) &&
					(outwardEntryErrors.used_gross_weight = "Enter valid gross weight");
				isValidWeightorRate(outwardEntry?.used_tare_weight) &&
					(outwardEntryErrors.used_tare_weight = "Enter valid tare weight");
				isValidWeightorRate(outwardEntry?.used_net_weight) &&
					(outwardEntryErrors.used_net_weight = "Enter valid net weight");

				if (
					+outwardEntry?.total_cheese + (+outwardEntry?.existing_cheese || 0) <
					+outwardEntry?.used_cheese
				) {
					outwardEntryErrors.used_cheese =
						"Used cheese should be less than or equal to available number of cheese";
				}

				if (
					+outwardEntry?.net_weight +
						(+outwardEntry?.existing_net_weight || 0) <
					+outwardEntry?.used_net_weight
				) {
					outwardEntryErrors.used_net_weight =
						"Used net weight should be less than or equal to available net weight";
				}

				outwardErrors[targetIndex] = outwardEntryErrors;
			});
			if (outwardErrors.length) {
				errors.outward_quantity = outwardErrors;
			}
			if (!values?.id) {
				let outwardQuantity = {};
				values?.outward_quantity?.forEach(oq => {
					if (oq?.outward_stock_from_id?.value) {
						if (oq?.outward_stock_from_id?.value in outwardQuantity) {
							errors.outward_quantity = {
								_error: "Duplicate Outward Entry selected",
							};
							return;
						} else {
							outwardQuantity[oq?.outward_stock_from_id?.value] = true;
						}
					}
				});
			}
		}
		return errors;
	},
})(OutwardForm);
