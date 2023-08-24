import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList,getMasterDetails,resetMasterDetails,repackingDetails } from "actions/master";
import { useParams,useNavigate } from "react-router-dom";
import QualityCheckForm from "./QualityCheckForm";
import { qualityCheckModalName, tableName } from "./qualityCheckConstants";
import { Spin } from "antd";
import { useEffect,useState } from "react";
import { getIsFetchingMasterDetails } from "reducers/master";
import { getQualityCheckMasterDetails } from "reducers/master";
import React from 'react'

const QualityCheckWrapper = () => {
    const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, id } = useParams();

    const [loading, setLoading] = useState(id ? true : false);

	const isViewOnly = mode === "view";
	const isEditing = mode === "edit";

	const QcDetails = useSelector(getQualityCheckMasterDetails);
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
			qc_pallet: formData?.qc_pallet?.map(qp => {
				return {
					...qp,
					pallet_id: qp?.id,
					dyeing_gradation: qp?.dyeing_gradation?.length
						? qp?.dyeing_gradation
						: null,
					location_id: qp?.location_id?.value,
				};
			}),
		};

		if (QcDetails?.id) {
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
		id: QcDetails.id || null,
		entry_no: QcDetails?.entry_no || null,
		entry_date: QcDetails?.entry_date,
		yarn_quality_id: QcDetails?.yarn_quality
			? {
					label: QcDetails?.yarn_quality?.name,
					value: QcDetails?.yarn_quality?.id,
			  }
			: null,
		lot_id: QcDetails?.lot
			? {
					label: QcDetails?.lot?.lot_no,
					value: QcDetails?.lot?.id,
			  }
			: null,
		shade_no: QcDetails?.shade_no || "Raw White",
		grade: QcDetails?.grade,
		total_cheese: QcDetails?.total_cheese,
		total_cartons: QcDetails?.total_cartons,
		total_net_weight: QcDetails?.total_net_weight,
		accepted_cheese: QcDetails?.accepted_cheese,
		accepted_cartons: QcDetails?.accepted_cartons,
		repacked_qc_pallet: QcDetails?.repacked_qc_pallet,
		qc_pallet:
			QcDetails?.qc_pallet?.map(qp => {
				return {
					...qp,
					location_id: qp?.location
						? { label: qp?.location?.name, value: qp?.location?.id }
						: null,
				};
			}) || [],
		update_qc_pallet: false,
		existing_cheese:
			QcDetails?.qc_pallet?.reduce((accumulator, currentValue) => {
				if (currentValue.hasOwnProperty("no_of_cheese")) {
					return accumulator + currentValue["no_of_cheese"];
				}
				return accumulator;
			}, 0) || 0,
		existing_net_weight:
			QcDetails?.qc_pallet?.reduce((accumulator, currentValue) => {
				if (currentValue.hasOwnProperty("net_weight")) {
					return accumulator + currentValue["net_weight"];
				}
				return accumulator;
			}, 0) || 0,
	};
    if (loading || isFetchingMasterDetails)
		return (
			<Spin
				className="h-100 d-flex justify-content-center align-items-center"
				size="large"
			/>
		);
    const title = isViewOnly
    ? `QC - ${QcDetails?.entry_no || ""}`
    : `${
            QcDetails?.id
                ? `Edit QC - ${QcDetails?.entry_no || ""}`
                : "Add QC"
      }`;
    
  return (
    <QualityCheckForm
				title={title}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onCancel={handleClose}
				isViewOnly={isViewOnly}
				isEditing={isEditing}
			/>
  )
}

export default QualityCheckWrapper