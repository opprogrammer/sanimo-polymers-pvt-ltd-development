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

import axios from "axios";
import apiConfig from "actions/apiConfig";
import { MdClose } from "react-icons/md";
import { useEffect } from "react";
import {
	getIsFetchingDropdownList,
	getIsUpdatingMasterList,
} from "reducers/master";
import { getUserDetails } from "reducers/user";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { onWheelHandler } from "utils/onWheelHandler";
import { renderModalButtons } from "utils/renderModalButtons";
import {
	isPositiveInteger,
	isRequired,
	isValidWeightorRate,
} from "utils/validations";
import {
	gradeOptions,
	grnTypeOptions,
	returnableTypeOptions,
	typeOfPackagingOptions,
	uomOptions,
} from "./grnConstants";
import { renderShadeEntry } from "./renderShadeEntry";

const formName = "grn";
const formSelector = formValueSelector(formName);

const GrnForm = ({
	title,
	onCancel,
	handleSubmit,
	isViewOnly,
	initialValues,
}) => {
	const dispatch = useDispatch();

	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);
	const isFetchingDropdown = useSelector(getIsFetchingDropdownList);

	const meta = useSelector(getFormMeta(formName));
	const errors = useSelector(getFormSyncErrors(formName));
	const shadeEntry = useSelector(state => formSelector(state, "shade_entry"));
	const updateShadeEntry = useSelector(state =>
		formSelector(state, "update_shade_entry")
	);
	const returnableType = useSelector(state =>
		formSelector(state, "returnable_type")
	);
	const typeOfPacking = useSelector(state =>
		formSelector(state, "type_of_packing")
	);
	const rate = useSelector(state => formSelector(state, "rate"));

	const updateShadeAmounts = rate => {
		shadeEntry?.forEach((shade, index) => {
			dispatch(
				change(
					formName,
					`shade_entry.[${index}].amount`,
					(+rate * +shade.net_weight).toFixed(4) || 0
				)
			);
		});
	};

	const updateAmount = (index, netWeight) => {
		dispatch(
			change(
				formName,
				`shade_entry.[${index}].amount`,
				(+rate * +netWeight).toFixed(4) || 0
			)
		);
	};

	const updateAvgWeight = (index, noOfCheese, netWeight) => {
		dispatch(
			change(
				formName,
				`shade_entry.[${index}].average_weight`,
				(+netWeight / (+noOfCheese ? +noOfCheese : 1)).toFixed(4) || 0
			)
		);
	};

	useEffect(() => {
		let totalAmount = shadeEntry?.reduce((acc, shadeEnt) => {
			return acc + (+shadeEnt?.amount || 0);
		}, 0);
		dispatch(change(formName, "total_amount", totalAmount.toFixed(4)));
	}, [shadeEntry, dispatch]);

	useEffect(() => {
		if (meta?.shade_entry && updateShadeEntry === false)
			dispatch(change(formName, "update_shade_entry", true));
	}, [meta?.shade_entry, updateShadeEntry, dispatch]);

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
								label="GRN Number"
								name="grn_no"
								placeholder="Enter GRN Number"
								disabled
							/>
						</Col>
					)}
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							label="GRN Date"
							name="grn_date"
							type="date"
							max="9999-12-31"
							placeholder="Enter GRN Date"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="grn_type"
							label="GRN Type"
							options={grnTypeOptions}
							disabled={isViewOnly}
							touched={meta?.grn_type?.touched}
							error={errors?.grn_type}
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
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="outward_id"
							label="Outward Number"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.outward_id?.touched}
							error={errors?.outward_id}
							placeholder="Enter Outward Number"
							masterDropdownName="outward"
							status={1}
						/>
					</Col>
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
							label="Security Inward Number"
							name="security_inward_no"
							placeholder="Enter Security Inward Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="date"
							max="9999-12-31"
							label="Security Inward Date"
							name="security_inward_date"
							placeholder="Enter Security Inward Date"
							disabled={isViewOnly}
						/>
					</Col>
				</Row>
				{/* <Row>
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
							label="Security Inward Number"
							name="security_inward_no"
							placeholder="Enter Security Inward Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="date"
							max="9999-12-31"
							label="Security Inward Date"
							name="security_inward_date"
							placeholder="Enter Security Inward Date"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="supplier_id"
							label="Supplier Name"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.supplier_id?.touched}
							error={errors?.supplier_id}
							masterDropdownName="party"
							placeholder="Supplier Name"
							query={{ party_type: "Vendor" }}
						/>
					</Col>
				</Row> */}
				<Row>
				<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="supplier_id"
							label="Supplier Name"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.supplier_id?.touched}
							error={errors?.supplier_id}
							masterDropdownName="party"
							placeholder="Supplier Name"
							query={{ party_type: "Vendor" }}
						/>
					</Col>
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
							component={ReduxFormTextField}
							maxLength={50}
							label="Invoice Number"
							name="invoice_no"
							placeholder="Enter Invoice Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="date"
							max="9999-12-31"
							label="Invoice Date"
							name="invoice_date"
							placeholder="Enter Invoice Date"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="lot_id"
							label="Lot Number"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.lot_id?.touched}
							error={errors?.lot_id}
							placeholder="Enter Lot Number"
							masterDropdownName="lot"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="returnable_type"
							label="Returnable"
							disabled={isFetchingDropdown || isViewOnly}
							options={returnableTypeOptions}
							touched={meta?.returnable_type?.touched}
							error={errors?.returnable_type}
							placeholder="Returnable Type"
						/>
					</Col>
				</Row>
				<Row>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="base_manufacturer_id"
							label="Base Manufacturer"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.base_manufacturer?.touched}
							error={errors?.base_manufacturer}
							masterDropdownName="party"
							placeholder="Base Manufacturer"
							query={{ party_type: "Vendor" }}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="process_id"
							label="Process Name"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.process_id?.touched}
							error={errors?.process_id}
							placeholder="Process Name"
							masterDropdownName="process"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							label="Shade Number"
							name="shade_no"
							component={ReduxFormTextField}
							maxLength={30}
							placeholder="Shade Number"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="uom"
							label="UOM"
							disabled={isFetchingDropdown || isViewOnly}
							options={uomOptions}
							touched={meta?.uom?.touched}
							error={errors?.uom}
							placeholder="Select UOM"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="type_of_packing"
							label="Type of Packing"
							disabled={isFetchingDropdown || isViewOnly}
							options={typeOfPackagingOptions}
							touched={meta?.type_of_packing?.touched}
							error={errors?.type_of_packing}
							placeholder="Type of Packing"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormSelectField}
							name="grade"
							label="Grade"
							options={gradeOptions}
							disabled={isViewOnly}
							touched={meta?.grade?.touched}
							error={errors?.grade}
						/>
					</Col>
				</Row>
				
				<Row>
				<Col className="mb-1">
						<Field
							component={ReduxFormAsyncSelect}
							name="yarn_quality_id"
							label="Quality Name"
							disabled={isFetchingDropdown || isViewOnly}
							touched={meta?.yarn_quality_id?.touched}
							error={errors?.yarn_quality_id}
							placeholder="Quality Name"
							masterDropdownName="yarn-quality"
						/>
					</Col>
					<Col className="mb-1">
						<Field
							label="Rate"
							name="rate"
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							placeholder="Rate"
							onChange={e => updateShadeAmounts(e.target.value)}
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Total Cheese"
							name="total_cheese"
							placeholder="Enter Total Cheese"
							disabled={isViewOnly}
						/>
					</Col>
					<Col className="mb-1">
						<Field
							component={ReduxFormTextField}
							type="number"
							onWheel={e => onWheelHandler(e)}
							label="Total Carton/Pallet"
							name="total_cartons"
							placeholder="Enter Total Carton/Pallet"
							disabled={isViewOnly}
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
						name="shade_entry"
						component={renderShadeEntry}
						shadeEntry={shadeEntry}
						isFetchingDropdown={isFetchingDropdown}
						updateAmount={updateAmount}
						updateAvgWeight={updateAvgWeight}
						errorsData={errors}
						metaData={meta}
						isViewOnly={isViewOnly}
						isReturnable={returnableType === "Returnable"}
						typeOfPacking={typeOfPacking}
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

		isRequired(values?.grn_type) && (errors.grn_type = "Required");
		isRequired(values?.supplier_id) && (errors.supplier_id = "Required");
		isRequired(values?.lot_id) && (errors.lot_id = "Required");
		isRequired(values?.grade) && (errors.grade = "Required");
		isRequired(values?.yarn_quality_id) &&
			(errors.yarn_quality_id = "Required");
		isRequired(values?.process_id) && (errors.process_id = "Required");
		isRequired(values?.uom) && (errors.uom = "Required");
		isRequired(values?.returnable_type) &&
			(errors.returnable_type = "Required");
		isRequired(values?.type_of_packing) &&
			(errors.type_of_packing = "Required");
		isRequired(values?.shade_no) && (errors.shade_no = "Required");

		let totalCheese = values?.shade_entry?.reduce((acc, shadeEnt) => {
			return acc + (+shadeEnt?.no_of_cheese || 0);
		}, 0);
		if (
			values?.total_cheese &&
			totalCheese &&
			(+values.total_cheese !== totalCheese || +values.total_cheese < 0)
		) {
			errors.total_cheese = "Please enter valid total cheese";
		}

		let totalNetWeight = values?.shade_entry?.reduce((acc, shadeEnt) => {
			return acc + (+shadeEnt?.net_weight || 0);
		}, 0);
		if (
			values?.total_net_weight &&
			totalNetWeight &&
			((+values.total_net_weight)?.toFixed(4) !== totalNetWeight?.toFixed(4) ||
				+values.total_net_weight < 0)
		) {
			errors.total_net_weight = "Please enter valid net weight";
		}

		let totalCartons = values?.shade_entry?.reduce((acc, shadeEnt) => {
			return acc + (+shadeEnt?.no_of_cartons || 0);
		}, 0);
		if (
			values?.total_cartons &&
			totalCartons &&
			(+values.total_cartons !== totalCartons || +values.total_cartons < 0)
		) {
			errors.total_cartons = "Please enter valid total cartons or pallet";
		}

		isRequired(values?.total_cheese) && (errors.total_cheese = "Required");
		isRequired(values?.total_cartons) && (errors.total_cartons = "Required");
		isRequired(values?.total_net_weight) &&
			(errors.total_net_weight = "Required");
		isRequired(values?.rate) && (errors.rate = "Required");
		isPositiveInteger(+values?.total_cartons) &&
			(errors.total_cartons = "Number of Cartons should be a positive integer");
		isPositiveInteger(+values?.total_cheese) &&
			(errors.total_cheese = "Number of Cheese should be a positive integer");

		isValidWeightorRate(values?.rate) && (errors.rate = "Enter valid rate");
		isValidWeightorRate(values?.total_net_weight) &&
			(errors.total_net_weight = "Enter valid Total Net Weight");

		if (!values?.shade_entry || values?.shade_entry?.length === 0) {
			errors.shade_entry = { _error: "Atleast one shade entry is required" };
		} else {
			const shadeErrors = [];
			values?.shade_entry?.forEach((shadeEntry, targetIndex) => {
				const shadeEntryError = {};

				isRequired(shadeEntry?.no_of_cheese) &&
					(shadeEntryError.no_of_cheese = "Required");
				isRequired(shadeEntry?.no_of_cartons) &&
					(shadeEntryError.no_of_cartons = "Required");
				isRequired(shadeEntry?.net_weight) &&
					(shadeEntryError.net_weight = "Required");
				isRequired(shadeEntry?.gross_weight) &&
					(shadeEntryError.gross_weight = "Required");
				isRequired(shadeEntry?.tare_weight) &&
					(shadeEntryError.tare_weight = "Required");
				isRequired(shadeEntry?.returnable_item) &&
					(shadeEntryError.returnable_item = "Required");

				isRequired(shadeEntry?.pallet_no) &&
					(shadeEntryError.pallet_no = "Required");
				isRequired(shadeEntry?.net_weight) &&
					(shadeEntryError.net_weight = "Required");

				isPositiveInteger(+shadeEntry?.no_of_cartons) &&
					(shadeEntryError.no_of_cartons =
						"Number of Carton/Pallet should be a positive integer");

				isPositiveInteger(+shadeEntry?.no_of_cheese) &&
					(shadeEntryError.no_of_cheese =
						"Number of Cheese should be a positive integer");

				isValidWeightorRate(shadeEntry?.returnable_item_rate) &&
					(shadeEntryError.returnable_item_rate =
						"Enter valid returnable item rate");
				isValidWeightorRate(shadeEntry?.gross_weight) &&
					(shadeEntryError.gross_weight = "Enter valid gross weight");
				isValidWeightorRate(shadeEntry?.tare_weight) &&
					(shadeEntryError.tare_weight = "Enter valid tare weight");
				isValidWeightorRate(shadeEntry?.net_weight) &&
					(shadeEntryError.net_weight = "Enter valid net weight");
				isValidWeightorRate(shadeEntry?.weight) &&
					(shadeEntryError.weight = "Enter valid weight");

				shadeErrors[targetIndex] = shadeEntryError;
			});
			if (shadeErrors.length) {
				errors.shade_entry = shadeErrors;
			}
		}
		return errors;
	},
})(GrnForm);
