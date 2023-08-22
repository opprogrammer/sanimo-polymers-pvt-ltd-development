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
	getDyeingPlanningMasterDetails,
	getIsFetchingMasterDetails,
} from "reducers/master";
import DyeingPlanningForm from "./DyeingPlanningForm";
import { tableName } from "./dyeingPlanningConstants";

const DyeingPlanningWrapper = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, id } = useParams();

	const [loading, setLoading] = useState(id ? true : false);

	const isViewOnly = mode === "view";
	const isEditing = mode === "edit";

	const dyeingPlanningDetails = useSelector(getDyeingPlanningMasterDetails);
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
			entry_date: formData?.entry_date?.length ? formData?.entry_date : null,
			ordered_yarn_quality_id: formData?.ordered_yarn_quality_id?.value || null,
			yarn_quality_id: formData?.yarn_quality_id?.value || null,
			shade_id: formData?.shade_id?.value || null,
			lot_id: formData?.lot_id?.value || null,
			dyeing_planning_sos: formData?.dyeing_planning_sos
				?.filter(sos => !!sos?.planned_net_weight)
				.map(sos => {
					return {
						id: sos?.id || null,
						sale_order_shade_id: sos?.sale_order_shade_id || null,
						planned_net_weight: sos?.planned_net_weight || null,
					};
				}),
		};

		if (dyeingPlanningDetails?.id) {
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
		id: dyeingPlanningDetails.id || null,
		entry_date: dyeingPlanningDetails?.entry_date || null,
		machine_no: dyeingPlanningDetails?.machine_no || null,
		ordered_yarn_quality_id: dyeingPlanningDetails.ordered_yarn_quality
			? {
					label: dyeingPlanningDetails.ordered_yarn_quality?.name,
					value: dyeingPlanningDetails.ordered_yarn_quality?.id,
			  }
			: null,
		yarn_quality_id: dyeingPlanningDetails.yarn_quality
			? {
					label: dyeingPlanningDetails.yarn_quality?.name,
					value: dyeingPlanningDetails.yarn_quality?.id,
			  }
			: null,
		shade_id: dyeingPlanningDetails.shade
			? {
					label: dyeingPlanningDetails.shade?.shade_no,
					value: dyeingPlanningDetails.shade?.id,
			  }
			: null,
		lot_id: dyeingPlanningDetails.lot
			? {
					label: dyeingPlanningDetails.lot?.lot_no,
					value: dyeingPlanningDetails.lot?.id,
			  }
			: null,
		total_planned_net_weight:
			dyeingPlanningDetails?.total_planned_net_weight || 0,
		dyeing_planning_sos:
			dyeingPlanningDetails?.dyeing_planning_sos?.map(sos => ({
				...sos,
				sale_order_shade_id: sos?.sale_order?.id || null,
			})) || [],
		update_dyeing_planning_sos: false,
	};
	if (loading || isFetchingMasterDetails)
		return (
			<Spin
				className="h-100 d-flex justify-content-center align-items-center"
				size="large"
			/>
		);

	const title = isViewOnly
		? `Dyeing Planning - ${dyeingPlanningDetails?.entry_no || ""}`
		: `${
				dyeingPlanningDetails?.id
					? `Edit Dyeing Planning - ${dyeingPlanningDetails?.entry_no || ""}`
					: "Add Dyeing Planning"
		  }`;

	return (
		<DyeingPlanningForm
			title={title}
			initialValues={initialValues}
			onSubmit={handleSubmit}
			onCancel={handleClose}
			isViewOnly={isViewOnly}
			isEditing={isEditing}
		/>
	);
};

export default DyeingPlanningWrapper;
