import React from 'react';
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";
import { addMasterList, editMasterList,getMasterDetails,resetMasterDetails,repackingDetails } from "actions/master";
import { Spin } from 'antd';
import { useParams,useNavigate } from "react-router-dom";
import IssueToDepartmentForm from "./IssueToDepartmentForm";
import {
	issueToDepartmentModalName,
	tableName,
} from "./issueToDepartmentConstants";
import { useEffect,useState } from "react";
import { getIsFetchingMasterDetails } from "reducers/master";
import { getIssueToDepartmentMasterDetails } from "reducers/master";


const IssueToDepartmentWrapper = () => {

    const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, id } = useParams();

    const [loading, setLoading] = useState(id ? true : false);

	const isViewOnly = mode === "view";
	const isEditing = mode === "edit";

	const issueToDepartmentDetails = useSelector(getIssueToDepartmentMasterDetails);
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
			yarn_quality_id: formData?.yarn_quality_id?.value,
			lot_id: formData?.lot_id?.value,
			tint: formData?.tint || null,
			dyeing_gradation: formData?.dyeing_gradation?.length
				? formData?.dyeing_gradation
				: null,
			trolley_no: formData?.trolley_no || null,
			checker_name: formData?.checker_name || null,
			itd_pallet: formData?.itd_pallet?.map(ip => {
				return {
					...ip,
					qc_pallet_id: ip?.qc_pallet?.id,
				};
			}),
		};
        if (issueToDepartmentDetails?.id) {
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
		id: issueToDepartmentDetails.id || null,
		slip_no: issueToDepartmentDetails?.slip_no || null,
		slip_date: issueToDepartmentDetails?.slip_date,
		yarn_quality_id: issueToDepartmentDetails?.yarn_quality
			? {
					label: issueToDepartmentDetails?.yarn_quality?.name,
					value: issueToDepartmentDetails?.yarn_quality?.id,
			  }
			: null,
		lot_id: issueToDepartmentDetails?.lot
			? {
					label: issueToDepartmentDetails?.lot?.lot_no,
					value: issueToDepartmentDetails?.lot?.id,
			  }
			: null,
		shade_no: issueToDepartmentDetails?.shade_no || "Raw White",
		grade: issueToDepartmentDetails?.grade,
		total_net_weight: issueToDepartmentDetails?.total_net_weight,
		total_cheese: issueToDepartmentDetails?.total_cheese,
		total_cartons: issueToDepartmentDetails?.total_cartons,
		dyeing_gradation: issueToDepartmentDetails?.dyeing_gradation,
		quality_gradation: issueToDepartmentDetails?.quality_gradation,
		tint: issueToDepartmentDetails?.tint,
		trolley_no: issueToDepartmentDetails?.trolley_no,
		checker_name: issueToDepartmentDetails?.checker_name,
		slip_type: issueToDepartmentDetails?.slip_type,
		issue_to_department: issueToDepartmentDetails?.issue_to_department,
		itd_pallet:
			issueToDepartmentDetails?.itd_pallet?.map(ip => {
				return {
					...ip,
					qc_pallet_id: ip?.qc_pallet,
					existing_cheese: ip?.used_cheese || 0,
					existing_net_weight: ip?.used_net_weight || 0,
					qc_pallet: { ...ip?.qc_pallet, location: ip?.location || null },
				};
			}) || [],
		update_itd_pallet: false,
	};

    if (loading || isFetchingMasterDetails)
		return (
			<Spin
				className="h-100 d-flex justify-content-center align-items-center"
				size="large"
			/>
		);
    const title = isViewOnly
    ? `IssueToDepartment - ${issueToDepartmentDetails?.slip_no || ""}`
    : `${
            issueToDepartmentDetails?.id
                ? `Edit IssueToDepartment - ${issueToDepartmentDetails?.slip_no || ""}`
                : "Add IssueToDepartment"
      }`;
  return (
    <IssueToDepartmentForm
				title={title}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onCancel={handleClose}
				isViewOnly={isViewOnly}
				isEditing={isEditing}
			/>
  )
}

export default IssueToDepartmentWrapper