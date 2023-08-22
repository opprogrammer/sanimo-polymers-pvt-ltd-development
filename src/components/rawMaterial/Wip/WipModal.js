import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList } from "actions/master";
import WipForm from "./WipForm";
import { tableName, wipModalName } from "./wipConstants";

const WipModal = () => {
	const dispatch = useDispatch();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === wipModalName;
	const data = activeModal?.data || {};

	const handleSubmit = formData => {
		const formValues = {
			...formData,
			lot_id: formData?.lot_id?.value,
			yarn_quality_id: formData?.yarn_quality_id?.value,
			wip_pallet: formData?.wip_pallet?.map(wp => {
				return {
					entry_id: wp?.entry_id?.value || null,
				};
			}),
		};
		if (data?.id) {
			dispatch(editMasterList(tableName, formValues));
		} else {
			dispatch(addMasterList(tableName, formValues));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(wipModalName));
	};

	const initialValues = {
		id: data.id || null,
		entry_no: data?.entry_no || null,
		entry_date: data?.entry_date,
		lot_id: data?.lot
			? {
					label: data?.lot?.lot_no,
					value: data?.lot?.id,
			  }
			: null,
		yarn_quality_id: data?.yarn_quality
			? {
					label: data?.yarn_quality?.name,
					value: data?.yarn_quality?.id,
			  }
			: null,
		grade: data?.grade || null,
		shade_no: data?.shade_no || "Raw White",
		total_cartons: data?.total_cartons,
		total_cheese: data?.total_cheese,
		entry_type: data?.entry_type,
		wip_pallet:
			data?.wip_pallet?.map(rp => {
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
			}) || [],
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
			<WipForm
				title={
					!!data?.isViewOnly ? data?.name : `${data?.id ? "Edit" : "Add"} WIP`
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

export default WipModal;
