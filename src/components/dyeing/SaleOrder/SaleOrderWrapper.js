import { useDispatch, useSelector } from "react-redux";

import {
	addMasterList,
	editMasterList,
	getMasterDetails,
	resetMasterDetails,
} from "actions/master";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	getIsFetchingMasterDetails,
	getSaleOrderMasterDetails,
} from "reducers/master";
import SaleOrderForm from "./SaleOrderForm";
import { tableName } from "./saleOrderConstants";

const SaleOrderFormWrapper = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, id } = useParams();

	const [loading, setLoading] = useState(id ? true : false);

	const isViewOnly = mode === "view";
	const saleorderdetails = useSelector(getSaleOrderMasterDetails);
	const isFetchingMasterDetails = useSelector(getIsFetchingMasterDetails);

	useEffect(() => {
		if (id) {
			dispatch(getMasterDetails(tableName, id));
			setLoading(false);
		}
		return () => dispatch(resetMasterDetails(tableName));
	}, [dispatch, id]);

	const handleSubmit = formData => {
		const formValues = {
			...formData,
			est_delivery_date: formData?.est_delivery_date?.length
				? formData?.est_delivery_date
				: null,
			party_id: formData?.party_id?.value || null,
			party_delivery_id: formData?.party_delivery_id || null,
			yarn_quality_id: formData?.yarn_quality_id?.value || null,
			grade: formData?.grade || null,
			process_id: formData?.process_id?.value || null,
			sale_order_shade: formData?.sale_order_shade?.map(sos => {
				return {
					id: sos?.id || null,
					shade_id: sos?.shade_id?.value || null,
					net_weight: sos?.net_weight || null,
					party_ref_shade_no: sos?.party_ref_shade_no || null,
					net_weight_with_tolerance: sos?.net_weight_with_tolerance || null,
					est_delivery_date: sos?.est_delivery_date || null,
				};
			}),
		};

		if (saleorderdetails?.id) {
			dispatch(
				editMasterList(tableName, formValues, 1, "application/json", () =>
					navigate(`/dyeing-${tableName}/1`)
				)
			);
		} else {
			dispatch(
				addMasterList(tableName, formValues, 1, "application/json", () =>
					navigate(`/dyeing-${tableName}/1`)
				)
			);
		}
	};
	const handleClose = () => {
		navigate(`/dyeing-${tableName}/1`);
	};

	const initialValues = {
		id: saleorderdetails.id || null,
		order_no: saleorderdetails?.order_no || null,
		order_date: saleorderdetails?.order_date || null,
		order_category: saleorderdetails?.order_category || null,
		est_delivery_date: saleorderdetails?.est_delivery_date || null,
		main_category: saleorderdetails?.main_category || null,
		batch_type: saleorderdetails?.batch_type || null,
		party_po_number: saleorderdetails?.party_po_number || null,
		transport_payment_method:
			saleorderdetails?.transport_payment_method || null,
		type_of_packing: saleorderdetails?.type_of_packing || null,
		length_per_weight: saleorderdetails?.length_per_weight || null,
		party_ref_quality_name: saleorderdetails?.party_ref_quality_name || null,
		grade: saleorderdetails?.grade || null,
		total_net_weight: saleorderdetails?.total_net_weight || null,
		rate: saleorderdetails?.rate || null,
		total_amount: saleorderdetails?.total_amount || null,
		order_by: saleorderdetails?.order_by || null,
		checked_by: saleorderdetails?.checked_by || null,
		authorized_by: saleorderdetails?.authorized_by || null,
		party_id: saleorderdetails.party
			? {
					label: saleorderdetails.party?.name,
					value: saleorderdetails.party?.id,
			  }
			: null,
		party_delivery_id: saleorderdetails.party_delivery?.id || null,
		yarn_quality_id: saleorderdetails.yarn_quality
			? {
					label: saleorderdetails.yarn_quality?.name,
					value: saleorderdetails.yarn_quality?.id,
			  }
			: null,
		process_id: saleorderdetails.process
			? {
					label: saleorderdetails.process?.name,
					value: saleorderdetails.process?.id,
			  }
			: null,
		sale_order_shade:
			saleorderdetails?.sale_order_shade?.map(sos => {
				return {
					...sos,
					shade_id: sos.shade
						? { label: sos.shade?.shade_no, value: sos.shade?.id }
						: null,
				};
			}) || [],
		update_sale_order_shade: false,
		cancel_sale_order: false,
	};
	if (loading || isFetchingMasterDetails)
		return (
			<Spin
				className="h-100 d-flex justify-content-center align-items-center"
				size="large"
			/>
		);

	const title = isViewOnly
		? `Sale Order - ${saleorderdetails?.order_no || ""}`
		: `${
				saleorderdetails?.id
					? `Edit Sale Order - ${saleorderdetails?.order_no || ""}`
					: "Add Sale Order"
		  }`;

	return (
		<SaleOrderForm
			title={title}
			initialValues={initialValues}
			onSubmit={handleSubmit}
			onCancel={handleClose}
			isViewOnly={isViewOnly}
		/>
	);
};

export default SaleOrderFormWrapper;
