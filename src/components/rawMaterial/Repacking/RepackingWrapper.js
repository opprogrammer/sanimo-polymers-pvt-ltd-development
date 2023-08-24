
import { useDispatch, useSelector } from "react-redux";

//import { closeModal } from "actions/modal";
//import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList,getMasterDetails,resetMasterDetails } from "actions/master";
import RepackingForm from "./RepackingForm";
import { tableName } from "./repackingConstants";
import { Spin } from "antd";
import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom/dist";
import { getRepackingMasterDetails,getIsFetchingMasterDetails } from "reducers/master";

import React from 'react'

export const RepackingWrapper = () => {
 
    const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, id } = useParams();

	const [loading, setLoading] = useState(id ? true : false);

	const isViewOnly = mode === "view";
	const isEditing = mode === "edit";

	const repackingDetails = useSelector(getRepackingMasterDetails);
	const isFetchingMasterDetails = useSelector(getIsFetchingMasterDetails);

	useEffect(() => {
		if (id) {
			dispatch(getMasterDetails(tableName, id));
			setLoading(false);
		}
		return () => dispatch(resetMasterDetails(tableName));
	}, [dispatch, id]);

	const handleSubmit = formData => {
        let repackedGrn = [];

		if (repackingDetails?.id) {
			formData?.repacked_grn?.forEach(rg => {
				repackedGrn = [...repackedGrn, ...rg?.shade_entry];
			});
		} else {
			formData?.repacked_grn?.forEach(rg => {
				const grnNumber = { grn_id: rg?.grn_no?.value };
				repackedGrn = [...repackedGrn, grnNumber];
			});
		}

		const formValues = {
			...formData,
			lot_id: formData?.lot_id?.value,
			yarn_quality_id: formData?.yarn_quality_id?.value,
			repacked_grn: repackedGrn,
			repacked_pallet: formData?.repacked_pallet?.map(rp => {
				return { ...rp, location_id: rp?.location_id?.value };
			}),
		};

		if (repackingDetails?.id) {
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
		id: repackingDetails.id || null,
		entry_no: repackingDetails?.entry_no || null,
		entry_date: repackingDetails?.entry_date,
		lot_id: repackingDetails?.lot
			? {
					label: repackingDetails?.lot?.lot_no,
					value: repackingDetails?.lot?.id,
			  }
			: null,
		yarn_quality_id: repackingDetails?.yarn_quality
			? {
					label: repackingDetails?.yarn_quality?.name,
					value: repackingDetails?.yarn_quality?.id,
			  }
			: null,
		grade: repackingDetails?.grade || null,
		shade_no: repackingDetails?.shade_no || "Raw White",
		total_cartons: repackingDetails?.total_cartons,
		total_cheese: repackingDetails?.total_cheese,
		total_net_weight: repackingDetails?.total_net_weight,
		repacked_grn:
			repackingDetails?.repacked_grn?.map(rg => {
				return {
					entry_type: rg?.entry_type,
					shade_entry: rg.shade_entry,
					grn_no: rg?.grn_no,
					total_cheese: rg?.total_cheese,
					total_cartons: rg?.total_cartons,
					total_net_weight: rg?.total_net_weight,
				};
			}) || [],
		repacked_pallet:
			repackingDetails?.repacked_pallet?.map(rp => {
				return {
					id: rp?.id,
					pallet_no: rp?.pallet_no,
					location_id: rp?.location
						? {
								label: rp?.location?.name,
								value: rp?.location?.id,
						  }
						: null,
					no_of_cheese: rp?.no_of_cheese,
					no_of_cartons: rp?.no_of_cartons,
					gross_weight: rp?.gross_weight,
					tare_weight: rp?.tare_weight,
					net_weight: rp?.net_weight,
					average_weight: rp?.average_weight,
				};
			}) || [],
		update_repacked_pallet: false,
	};
	if (loading || isFetchingMasterDetails)
		return (
			<Spin
				className="h-100 d-flex justify-content-center align-items-center"
				size="large"
			/>
		);

	const title = isViewOnly
		? `Repacking - ${repackingDetails?.entry_no || ""}`
		: `${
				repackingDetails?.id
					? `Edit Repacking - ${repackingDetails?.entry_no || ""}`
					: "Add Repacking"
		  }`;

	return (
		<RepackingForm
			title={title}
			initialValues={initialValues}
			onSubmit={handleSubmit}
			onCancel={handleClose}
			isViewOnly={isViewOnly}
			isEditing={isEditing}
		/>
	);
};
