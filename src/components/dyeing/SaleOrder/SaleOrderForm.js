import { Col, Row } from "react-bootstrap";
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
import { gradeOptions } from "components/rawMaterial/Grn/grnConstants";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
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
import { isRequired, isValidWeightorRate } from "utils/validations";
import { renderSaleOrderShade } from "./renderSaleOrderShade";
import {
	batchTypeOptions,
	dyedOrderCategoryOptions,
	mainCategoryOptions,
	nonDyedOrderCategoryOptions,
} from "./saleOrderConstants";

const formName = "saleOrder";
const formSelector = formValueSelector(formName);

const SaleOrderForm = ({ title, onCancel, handleSubmit, isViewOnly }) => {
	const dispatch = useDispatch();

	const [partyDetails, setPartyDetails] = useState({});

	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);
	const isFetchingDropdown = useSelector(getIsFetchingDropdownList);

	const meta = useSelector(getFormMeta(formName));
	const errors = useSelector(getFormSyncErrors(formName));
	const mainCategory = useSelector(state =>
		formSelector(state, "main_category")
	);
	const orderCategory = useSelector(state =>
		formSelector(state, "order_category")
	);
	const saleOrderShade = useSelector(state =>
		formSelector(state, "sale_order_shade")
	);
	const estimateDeliveryDate = useSelector(state =>
		formSelector(state, "est_delivery_date")
	);
	const tolerancePercent = useSelector(state =>
		formSelector(state, "tolerance_percent")
	);
	const toleranceMaxWeight = useSelector(state =>
		formSelector(state, "tolerance_max_weight")
	);

	const batchType = useSelector(state => formSelector(state, "batch_type"));
	const partyId = useSelector(state => formSelector(state, "party_id"));
	const [deliveryAddressOptions, setDeliveryAddressOptions] = useState([]);
	const { userId } = useSelector(getUserDetails);
	const partyDeliveryName = useSelector(state =>
		formSelector(state, "party_delivery_id")
	);
	const yarnQuality = useSelector(state =>
		formSelector(state, "yarn_quality_id")
	);

	useEffect(() => {
		const config = {
			headers: apiConfig?.getHeaders(),
		};

		if (partyId?.value) {
			axios
				.get(
					`${apiConfig?.baseURL}/v1/user/${userId}/party/list?id=${partyId?.value}`,
					config
				)
				.then(res => {
					setPartyDetails(res?.data?.data);
					setDeliveryAddressOptions(
						res?.data?.data?.delivery?.map(add => ({
							label: add?.address_1,
							value: add?.id,
						}))
					);
				});
		} else {
			setPartyDetails({});
		}
	}, [userId, partyId]);

	useEffect(() => {
		if (partyDetails?.id && batchType) {
			const isSmallBatch = batchType === "Small Batch";
			const tolerancePercentage = isSmallBatch
				? partyDetails?.small_batch_tolerance || 0
				: partyDetails?.big_batch_tolerance || 0;
			const toleranceWeight = isSmallBatch
				? partyDetails?.small_batch_max_weight || 0
				: partyDetails?.big_batch_max_weight || 0;
			dispatch(change(formName, "tolerance_percent", tolerancePercentage));
			dispatch(change(formName, "tolerance_max_weight", toleranceWeight));
		} else {
			dispatch(change(formName, "tolerance_percent", 0));
			dispatch(change(formName, "tolerance_max_weight", 0));
		}
	}, [dispatch, batchType, partyDetails]);

	const updateSaleOrderShade = useSelector(state =>
		formSelector(state, "update_sale_order_shade")
	);

	const updateToleranceWeight = (index, netWeight) => {
		const toleranceNetWeight =
			+netWeight * (+tolerancePercent / 100) +
			netWeight * (+tolerancePercent / 100);
		const toleranceWeight =
			toleranceNetWeight > +toleranceMaxWeight
				? +toleranceMaxWeight
				: toleranceNetWeight;

		dispatch(
			change(
				formName,
				`sale_order_shade.[${index}].net_weight_with_tolerance`,
				(+netWeight + +toleranceWeight).toFixed(4) || 0
			)
		);
	};

	useEffect(() => {
		let totalNetWeight = saleOrderShade?.reduce((acc, shadeEnt) => {
			return acc + (+shadeEnt?.net_weight || 0);
		}, 0);
		dispatch(change(formName, "total_net_weight", totalNetWeight?.toFixed(4)));
	}, [saleOrderShade, dispatch]);

	useEffect(() => {
		if (meta?.sale_order_shade && updateSaleOrderShade === false)
			dispatch(change(formName, "update_sale_order_shade", true));
	}, [meta?.sale_order_shade, updateSaleOrderShade, dispatch]);

	const fetchReferenceName = (isYarnQuality, id, index = null) => {
		const config = {
			headers: apiConfig?.getHeaders(),
		};

		const query = {
			party_id: partyId?.value,
			yarn_quality_id: isYarnQuality ? id : "",
			shade_id: isYarnQuality ? "" : id,
		};

		if (partyId?.value) {
			axios
				.get(
					`${
						apiConfig?.baseURL
					}/v1/user/${userId}/reference/name?${stringifyQueryParams(query)}`,
					config
				)
				.then(res => {
					isYarnQuality
						? dispatch(
								change(
									formName,
									"party_ref_quality_name",
									res?.data?.data?.reference_name
								)
						  )
						: dispatch(
								change(
									formName,
									`sale_order_shade.[${index}].party_ref_shade_no`,
									res?.data?.data?.reference_name
								)
						  );
				});
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="d-flex justify-content-between">
				{title && <h3 style={{ textTransform: "capitalize" }}>{title}</h3>}
				<button className="btn" type="button" onClick={onCancel}>
					<MdClose className="me-1 fs-4" />
				</button>
			</div>
			<Row>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						label="Order Date"
						name="order_date"
						type="date"
						max="9999-12-31"
						placeholder="Enter Order Date"
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						label="Estimate Delivery Date"
						name="est_delivery_date"
						type="date"
						max="9999-12-31"
						placeholder="Enter Estimate Delivery Date"
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormSelectField}
						name="main_category"
						label="Main Category"
						options={mainCategoryOptions}
						disabled={isViewOnly || orderCategory}
						touched={meta?.main_category?.touched}
						error={errors?.main_category}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormSelectField}
						name="order_category"
						label="Order Category"
						options={
							mainCategory === "Dyed"
								? dyedOrderCategoryOptions
								: nonDyedOrderCategoryOptions
						}
						disabled={isViewOnly || !mainCategory}
						touched={meta?.order_category?.touched}
						error={errors?.order_category}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormSelectField}
						name="batch_type"
						label="Batch Type"
						options={batchTypeOptions}
						disabled={isViewOnly || saleOrderShade?.length}
						touched={meta?.batch_type?.touched}
						error={errors?.batch_type}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						maxLength={50}
						label="Party PO Number"
						name="party_po_number"
						placeholder="Enter Party PO Number"
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormAsyncSelect}
						name="party_id"
						label="Party Name"
						disabled={
							isFetchingDropdown ||
							isViewOnly ||
							partyDeliveryName ||
							saleOrderShade?.length
						}
						touched={meta?.party_id?.touched}
						error={errors?.party_id}
						masterDropdownName="party"
						placeholder="Party Name"
						query={{ party_type: "customer" }}
					/>
				</Col>
			</Row>
			<Row>
				<Col className="mb-1">
					<Field
						component={ReduxFormSelectField}
						name="party_delivery_id"
						label="Delivery Address"
						options={deliveryAddressOptions}
						disabled={isViewOnly || !partyId?.value}
						touched={meta?.party_delivery_id?.touched}
						error={errors?.party_delivery_id}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						maxLength={200}
						label="Transport Payment Method"
						name="transport_payment_method"
						placeholder="Enter Transport Payment Method"
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						maxLength={100}
						label="Type of Package"
						name="type_of_packing"
						placeholder="Enter Type of Package"
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						maxLength={100}
						label="Length/Weight"
						name="length_per_weight"
						placeholder="Enter Length/Weight"
						disabled={isViewOnly}
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
							!partyId ||
							saleOrderShade?.length
						}
						touched={meta?.yarn_quality_id?.touched}
						error={errors?.yarn_quality_id}
						onChange={e => fetchReferenceName(true, e?.value)}
						placeholder="Quality Name"
						masterDropdownName="yarn-quality"
					/>
				</Col>
			</Row>
			<Row>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						maxLength={200}
						label="Party Ref Quality Name"
						name="party_ref_quality_name"
						placeholder="Enter Party Ref Quality Name"
						disabled={isViewOnly}
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
						component={ReduxFormTextField}
						maxLength={200}
						label="Order By"
						name="order_by"
						placeholder="Enter Order By"
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						maxLength={200}
						label="Checked By"
						name="checked_by"
						placeholder="Enter Checked By"
						disabled={isViewOnly}
					/>
				</Col>
			</Row>
			<Row>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						maxLength={200}
						label="Authorized By"
						name="authorized_by"
						placeholder="Enter Authorized By"
						disabled={isViewOnly}
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
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						type="number"
						label="Tolerance Percentage"
						name="tolerance_percent"
						disabled
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						type="number"
						label="Tolerance Weight"
						name="tolerance_max_weight"
						disabled
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						type="number"
						onWheel={e => onWheelHandler(e)}
						label="Total Order Quantity"
						name="total_net_weight"
						placeholder="Enter Total Order Quantity"
						disabled
					/>
				</Col>
			</Row>
			<Row className="mt-2">
				<FieldArray
					name="sale_order_shade"
					component={renderSaleOrderShade}
					isFetchingDropdown={isFetchingDropdown}
					metaData={meta}
					errorsData={errors}
					isViewOnly={isViewOnly}
					yarnQuality={yarnQuality}
					estimateDeliveryDate={estimateDeliveryDate}
					addDisabled={!yarnQuality?.value || !partyId || !batchType}
					updateToleranceWeight={updateToleranceWeight}
					fetchReferenceName={fetchReferenceName}
				/>
			</Row>
			<hr className="my-2"></hr>
			{renderModalButtons(onCancel, isUpdatingMaster || isViewOnly)}
		</form>
	);
};

export default reduxForm({
	form: formName,
	validate: values => {
		const errors = {};

		isRequired(values?.order_date) && (errors.order_date = "Required");
		isRequired(values?.main_category) && (errors.main_category = "Required");
		isRequired(values?.order_category) && (errors.order_category = "Required");
		isRequired(values?.batch_type) && (errors.batch_type = "Required");
		isRequired(values?.party_id) && (errors.party_id = "Required");
		isRequired(values?.yarn_quality_id) &&
			(errors.yarn_quality_id = "Required");
		isRequired(values?.party_ref_quality_name) &&
			(errors.party_ref_quality_name = "Required");
		isRequired(values?.grade) && (errors.grade = "Required");
		isRequired(values?.process_id) && (errors.process_id = "Required");
		isRequired(values?.order_by) && (errors.order_by = "Required");
		isRequired(values?.rate) && (errors.rate = "Required");
		isValidWeightorRate(values?.rate) && (errors.rate = "Enter valid rate");

		if (!values?.sale_order_shade || values?.sale_order_shade?.length === 0) {
			errors.sale_order_shade = {
				_error: "Atleast one Sale Order Shade Entry is required",
			};
		} else {
			const saleOrderShadeErrors = [];
			values?.sale_order_shade?.forEach((saleOrderShade, targetIndex) => {
				const saleOrderShadeError = {};
				isRequired(saleOrderShade?.shade_id) &&
					(saleOrderShadeError.shade_id = "Required");
				isRequired(saleOrderShade?.party_ref_shade_no) &&
					(saleOrderShadeError.party_ref_shade_no = "Required");
				isRequired(saleOrderShade?.net_weight) &&
					(saleOrderShadeError.net_weight = "Required");
				isRequired(saleOrderShade?.est_delivery_date) &&
					(saleOrderShadeError.est_delivery_date = "Required");
				isValidWeightorRate(saleOrderShade?.net_weight) &&
					(saleOrderShadeError.net_weight = "Enter valid net weight");

				saleOrderShadeErrors[targetIndex] = saleOrderShadeError;
			});
			if (saleOrderShadeErrors.length) {
				errors.sale_order_shade = saleOrderShadeErrors;
			}
		}
		return errors;
	},
	enableReinitialize: true,
})(SaleOrderForm);
