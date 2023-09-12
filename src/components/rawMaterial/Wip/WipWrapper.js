//import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

// import { closeModal } from "actions/modal";
// import { getActiveModal } from "reducers/modal";
import { useState,useEffect } from "react";
import { addMasterList, editMasterList } from "actions/master";
import WipForm from "./WipForm";
import { tableName } from "./wipConstants";
import { Spin } from "antd";
//import { tableName, wipModalName } from "./wipConstants";
import { useNavigate,useParams } from "react-router-dom/dist";
import { getWipMasterDetails,getIsFetchingMasterDetails } from "reducers/master";
import { getMasterDetails,resetMasterDetails } from "actions/master";

import React from 'react'

const WipWrapper = () => {
    const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, id } = useParams();

	const [loading, setLoading] = useState(id ? true : false);

	const isViewOnly = mode === "view";
	const isEditing = mode === "edit";

    const wipDetails = useSelector(getWipMasterDetails);
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
			lot_id: formData?.lot_id?.value,
			yarn_quality_id: formData?.yarn_quality_id?.value,
			wip_pallet: formData?.wip_pallet?.map(wp => {
				return {
					entry_id: wp|| null,
					//pallet_no: wp?.pallet_no?.value || null,
				};
				
			}),
			// wip_pallet: checkedIds?.map(wp => {
			// 	return {
			// 		entry_id: wp?.id?.value || null,
			// 		pallet_no: wp?.pallet_no?.value || null
			// 	};
			// }),
			
		};
		
		if (wipDetails?.id) {
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
		id: wipDetails.id || null,
		entry_no: wipDetails?.entry_no || null,
		entry_date: wipDetails?.entry_date,
		lot_id: wipDetails?.lot
			? {
					label: wipDetails?.lot?.lot_no,
					value: wipDetails?.lot?.id,
			  }
			: null,
		yarn_quality_id: wipDetails?.yarn_quality
			? {
					label: wipDetails?.yarn_quality?.name,
					value: wipDetails?.yarn_quality?.id,
			  }
			: null,
		grade: wipDetails?.grade || null,
		shade_no: wipDetails?.shade_no || "Raw White",
		total_cartons: wipDetails?.total_cartons,
		total_cheese: wipDetails?.total_cheese,
		entry_type: wipDetails?.entry_type,
		wip_pallet:
			wipDetails?.wip_pallet?.map(rp => {
				return {
					...rp,
					pallet_entry: { ...rp },
					entry_id: rp?.entry_id
						? { label: rp?.pallet_no, value: rp?.entry_id }
						: null,
					location_id: rp?.location
						? {
								label: rp?.location?.name,
								value: rp?.location?.id,
						  }
						: null,
				};
				// return {
				// 	...rp,
				// 	pallet_entry: { ...rp },
				// 	entry_id: rp?.id
				// 		|| null,
				// 	location_id: rp?.location
				// 		? {
				// 				label: rp?.location?.name,
				// 				value: rp?.location?.id,
				// 		  }
				// 		: null,
				// };
			}) || [],
	};

    if (loading || isFetchingMasterDetails)
		return (
			<Spin
				className="h-100 d-flex justify-content-center align-items-center"
				size="large"
			/>
		);

	const title = isViewOnly
		? `WIP - ${wipDetails?.entry_no || ""}`
		: `${
				wipDetails?.id
					? `Edit WIP - ${wipDetails?.entry_no || ""}`
					: "Add WIP"
		  }`;
  return (
    <WipForm
			title={title}
			initialValues={initialValues}
			onSubmit={handleSubmit}
			onCancel={handleClose}
			isViewOnly={isViewOnly}
			isEditing={isEditing}
		/>
  )
}

export default WipWrapper