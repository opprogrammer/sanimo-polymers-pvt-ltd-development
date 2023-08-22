import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList } from "actions/master";
import { useParams } from "react-router-dom";
import QualityCheckForm from "./QualityCheckForm";
import { qualityCheckModalName, tableName } from "./qualityCheckConstants";

const QualityCheckModal = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === qualityCheckModalName;
	const data = activeModal?.data || {};

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

		if (data?.id) {
			dispatch(editMasterList(tableName, formValues, status));
		} else {
			dispatch(addMasterList(tableName, formValues, status));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(qualityCheckModalName));
	};

	const initialValues = {
		id: data.id || null,
		entry_no: data?.entry_no || null,
		entry_date: data?.entry_date,
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
		total_cheese: data?.total_cheese,
		total_cartons: data?.total_cartons,
		total_net_weight: data?.total_net_weight,
		accepted_cheese: data?.accepted_cheese,
		accepted_cartons: data?.accepted_cartons,
		repacked_qc_pallet: data?.repacked_qc_pallet,
		qc_pallet:
			data?.qc_pallet?.map(qp => {
				return {
					...qp,
					location_id: qp?.location
						? { label: qp?.location?.name, value: qp?.location?.id }
						: null,
				};
			}) || [],
		update_qc_pallet: false,
		existing_cheese:
			data?.qc_pallet?.reduce((accumulator, currentValue) => {
				if (currentValue.hasOwnProperty("no_of_cheese")) {
					return accumulator + currentValue["no_of_cheese"];
				}
				return accumulator;
			}, 0) || 0,
		existing_net_weight:
			data?.qc_pallet?.reduce((accumulator, currentValue) => {
				if (currentValue.hasOwnProperty("net_weight")) {
					return accumulator + currentValue["net_weight"];
				}
				return accumulator;
			}, 0) || 0,
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
			<QualityCheckForm
				title={
					!!data?.isViewOnly ? data?.name : `${data?.id ? "Edit" : "Add"} QC`
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

export default QualityCheckModal;
