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
import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import {
	getIsFetchingDropdownList,
	getIsUpdatingMasterList,
} from "reducers/master";
import { getUserDetails } from "reducers/user";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { onWheelHandler } from "utils/onWheelHandler";
import { renderModalButtons } from "utils/renderModalButtons";
import stringifyQueryParams from "utils/stringifyQueryParams";
import { isRequired, isValidWeightorRate } from "utils/validations";
import { renderDyeingPlanningShades } from "./renderDyeingPlanningShades";

const formName = "dyeingPlanning";
const formSelector = formValueSelector(formName);

const DyeingPlanningForm = ({
	title,
	onCancel,
	handleSubmit,
	isViewOnly,
	isEditing,
}) => {
	const dispatch = useDispatch();

	const isUpdatingMaster = useSelector(getIsUpdatingMasterList);
	const isFetchingDropdown = useSelector(getIsFetchingDropdownList);

	const meta = useSelector(getFormMeta(formName));
	const errors = useSelector(getFormSyncErrors(formName));

	const dyeingPlanningSos = useSelector(state =>
		formSelector(state, "dyeing_planning_sos")
	);
	const yarnQualityId = useSelector(state =>
		formSelector(state, "yarn_quality_id")
	);
	const shadeId = useSelector(state => formSelector(state, "shade_id"));
	const updateDyeingPlanningShade = useSelector(state =>
		formSelector(state, "update_dyeing_planning_sos")
	);

	const { userId } = useSelector(getUserDetails);

	useEffect(() => {
		let totalAmount = dyeingPlanningSos?.reduce((acc, shadeEnt) => {
			return acc + (+shadeEnt?.planned_net_weight || 0);
		}, 0);

		dispatch(
			change(formName, "total_planned_net_weight", totalAmount?.toFixed(4))
		);
	}, [dyeingPlanningSos, dispatch]);

	useEffect(() => {
		if (meta?.dyeing_planning_sos && updateDyeingPlanningShade === false)
			dispatch(change(formName, "update_dyeing_planning_sos", true));
	}, [meta?.dyeing_planning_sos, updateDyeingPlanningShade, dispatch]);

	const fetchSaleOrderShadeList = () => {
		const config = {
			headers: apiConfig?.getHeaders(),
		};

		const query = {
			shade_id: shadeId?.value,
			yarn_quality_id: yarnQualityId?.value,
		};

		axios
			.get(
				`${
					apiConfig?.baseURL
				}/v1/user/${userId}/sale-order/shade/list?${stringifyQueryParams(
					query
				)}`,
				config
			)
			.then(res => {
				dispatch(
					change(
						formName,
						"dyeing_planning_sos",
						res?.data?.data?.results.map(shades => ({
							...shades,
							id: null,
							sale_order_shade_id: shades?.id,
						}))
					)
				);
			});
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
						label="Entry Date"
						name="entry_date"
						type="date"
						max="9999-12-31"
						placeholder="Enter Entry Date"
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormTextField}
						maxLength={10}
						label="M/c No"
						name="machine_no"
						placeholder="Enter M/c No"
						disabled={isViewOnly}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormAsyncSelect}
						name="ordered_yarn_quality_id"
						label="Ordered Quality Name"
						disabled={isViewOnly}
						touched={meta?.ordered_yarn_quality_id?.touched}
						error={errors?.ordered_yarn_quality_id}
						masterDropdownName="yarn-quality"
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormAsyncSelect}
						name="yarn_quality_id"
						label="Quality Name"
						disabled={isViewOnly || isEditing}
						touched={meta?.yarn_quality_id?.touched}
						error={errors?.yarn_quality_id}
						masterDropdownName="yarn-quality"
					/>
				</Col>
			</Row>
			<Row>
				<Col className="mb-1">
					<Field
						component={ReduxFormAsyncSelect}
						name="shade_id"
						label="Shade Number"
						disabled={isFetchingDropdown || isViewOnly || isEditing}
						touched={meta?.shade_id?.touched}
						error={errors?.shade_id}
						placeholder="Enter Shade Number"
						masterDropdownName="shade"
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
						component={ReduxFormTextField}
						type="number"
						onWheel={e => onWheelHandler(e)}
						label="Total Planned Quantity"
						name="total_planned_net_weight"
						placeholder="Enter Total Planned Quantity"
						disabled
					/>
				</Col>
			</Row>
			<Row className="mt-2">
				<FieldArray
					name="dyeing_planning_sos"
					component={renderDyeingPlanningShades}
					metaData={meta}
					errorsData={errors}
					isViewOnly={isViewOnly}
					isEditing={isEditing}
					dyeingPlanningSos={dyeingPlanningSos}
					disableFetch={!shadeId || !yarnQualityId}
					fetchSaleOrderShadeList={fetchSaleOrderShadeList}
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

		isRequired(values?.entry_date) && (errors.entry_date = "Required");
		isRequired(values?.machine_no) && (errors.machine_no = "Required");
		isRequired(values?.ordered_yarn_quality_id) &&
			(errors.ordered_yarn_quality_id = "Required");
		isRequired(values?.yarn_quality_id) &&
			(errors.yarn_quality_id = "Required");
		isRequired(values?.shade_id) && (errors.shade_id = "Required");
		isRequired(values?.lot_id) && (errors.lot_id = "Required");

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
				isRequired(saleOrderShade?.machine_no) &&
					(saleOrderShadeError.machine_no = "Required");
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
})(DyeingPlanningForm);
