import React from 'react'
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList,getMasterDetails,resetMasterDetails } from "actions/master";
import { useParams,useNavigate } from "react-router-dom";
import OutwardForm from "./OutwardForm";
import {
	issueToDepartmentModalName,
	tableName,
} from "./outwardConstants";
import { useEffect,useState } from "react";
import { getIsFetchingMasterDetails } from "reducers/master";
import { getOutwardMasterDetails } from "reducers/master";
import { Spin } from 'antd';

const OutwardWrapper = () => {

    const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, id } = useParams();

    const [loading, setLoading] = useState(id ? true : false);

	const isViewOnly = mode === "view";
	const isEditing = mode === "edit";

	const outwardDetails = useSelector(getOutwardMasterDetails);
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
			outward_date: formData?.outward_date?.length
				? formData?.outward_date
				: null,
			security_outward_date: formData?.security_outward_date?.length
				? formData?.security_outward_date
				: null,
			challan_date: formData?.challan_date?.length
				? formData?.challan_date
				: null,
			supplier_id: formData?.supplier_id?.value || null,
			party_id: formData?.party_id?.value || null,
			yarn_quality_id: formData?.yarn_quality_id?.value || null,
			transport_id: formData?.transport_id?.value || null,
			process_id: formData?.process_id?.value || null,
			lot_id: formData?.lot_id?.value || null,
			outward_quantity: formData?.outward_quantity?.map(oq => {
				return {
					...oq,
					id: oq?.id || null,
					outward_stock_from_id: oq?.outward_stock_from_id?.value || null,
					used_cheese: oq?.used_cheese || null,
					used_cartons: oq?.used_cartons || null,
					used_gross_weight: oq?.used_gross_weight || null,
					used_tare_weight: oq?.used_tare_weight || null,
					used_net_weight: oq?.used_net_weight || null,
				};
			}),
		};

		if (outwardDetails?.id) {
			dispatch(
				editMasterList(tableName, formValues, 1, "application/json", () =>
					navigate(`/raw-material-${tableName}/1`)
				)
			);
		} else {
			dispatch(
				addMasterList(tableName, formValues, 1, "application/json", () =>
					navigate(`/raw-material-${tableName}/1`)
				)
			);
		}
	};

	const handleClose = () => {
		navigate(`/raw-material-${tableName}/1`);
	};

    const initialValues = {
		id: outwardDetails.id || null,
		outward_no: outwardDetails.outward_no || null,
		outward_date: outwardDetails.outward_date || null,
		outward_type: outwardDetails.outward_type || null,
		transport_id: outwardDetails.transport
			? { label: outwardDetails.transport?.name, value: outwardDetails.transport?.id }
			: null,
		vehicle_no: outwardDetails.vehicle_no || null,
		security_outward_no: outwardDetails.security_outward_no || null,
		security_outward_date: outwardDetails.security_outward_date || null,
		party_id: outwardDetails.party
			? { label: outwardDetails.party?.name, value: outwardDetails.party?.id }
			: null,
		challan_no: outwardDetails.challan_no || null,
		challan_date: outwardDetails.challan_date || null,
		outward_stock_from: outwardDetails?.outward_stock_from || null,
		lot_id: outwardDetails.lot ? { label: outwardDetails.lot?.lot_no, value: outwardDetails.lot?.id } : null,
		shade_no: outwardDetails.shade_no || "Raw White",
		grade: outwardDetails?.grade || null,
		yarn_quality_id: outwardDetails.yarn_quality
			? { label: outwardDetails.yarn_quality?.name, value: outwardDetails.yarn_quality?.id }
			: null,
		total_cheese: outwardDetails.total_cheese || null,
		total_cartons: outwardDetails.total_cartons || null,
		rate: outwardDetails.rate || null,
		total_amount: outwardDetails.total_amount || null,
		outward_quantity: outwardDetails?.outward_quantity?.map(oq => {
			return {
				...oq,
				outward_stock_from_id: oq.outward_stock_from_id
					? {
							label: oq.outward_stock_from_label,
							value: oq.outward_stock_from_id,
					  }
					: null,
				pallet_entry: { ...oq },
				existing_cheese: oq?.used_cheese || 0,
				existing_net_weight: oq?.used_net_weight || 0,
			};
		}),
		update_outward_quantity: false,
	};

    if (loading || isFetchingMasterDetails)
		return (
			<Spin
				className="h-100 d-flex justify-content-center align-items-center"
				size="large"
			/>
		);
    const title = isViewOnly
    ? `Outward - ${outwardDetails?.slip_no || ""}`
    : `${
            outwardDetails?.id
                ? `Edit Outward - ${outwardDetails?.outward_no || ""}`
                : "Add Outward"
      }`;

  return (
    <OutwardForm
    title={title}
    initialValues={initialValues}
    onSubmit={handleSubmit}
    onCancel={handleClose}
    isViewOnly={isViewOnly}
    isEditing={isEditing}
/>
  )
}

export default OutwardWrapper