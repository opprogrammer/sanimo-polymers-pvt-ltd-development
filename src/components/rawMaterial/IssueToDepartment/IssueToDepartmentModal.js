import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList } from "actions/master";
import { useParams } from "react-router-dom";
import IssueToDepartmentForm from "./IssueToDepartmentForm";
import {
	issueToDepartmentModalName,
	tableName,
} from "./issueToDepartmentConstants";


const IssueToDepartmentModal = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === issueToDepartmentModalName;
	const data = activeModal?.data || {};

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

		if (data?.id) {
			dispatch(editMasterList(tableName, formValues, status));
		} else {
			dispatch(addMasterList(tableName, formValues, status));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(issueToDepartmentModalName));
	};

	const initialValues = {
		id: data.id || null,
		slip_no: data?.slip_no || null,
		slip_date: data?.slip_date,
		yarn_quality_id: data?.yarn_quality
			? {
					label: data?.yarn_quality?.name,
					value: data?.yarn_quality?.id,
			  }
			: null,
		lot_id: data?.lot
			? {
					label: data?.lot?.lot_no,
					value: data?.lot?.id,
			  }
			: null,
		shade_no: data?.shade_no || "Raw White",
		grade: data?.grade,
		total_net_weight: data?.total_net_weight,
		total_cheese: data?.total_cheese,
		total_cartons: data?.total_cartons,
		dyeing_gradation: data?.dyeing_gradation,
		quality_gradation: data?.quality_gradation,
		tint: data?.tint,
		trolley_no: data?.trolley_no,
		checker_name: data?.checker_name,
		slip_type: data?.slip_type,
		issue_to_department: data?.issue_to_department,
		itd_pallet:
			data?.itd_pallet?.map(ip => {
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

	return (
		<Modal
			show={open}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			centered
			size="xl"
		>
			<IssueToDepartmentForm
				title={
					!!data?.isViewOnly
						? data?.name
						: `${data?.id ? "Edit" : "Add"} Issue To Department`
				}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onCancel={handleClose}
				isViewOnly={!!data?.isViewOnly}
				isEditing={!!data?.id}
			/>
		</Modal>
	);
};

export default IssueToDepartmentModal;
