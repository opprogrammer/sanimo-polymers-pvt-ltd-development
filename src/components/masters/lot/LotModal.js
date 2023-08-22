import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { addMasterList, editMasterList } from "actions/master";
import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { lotModalName, masterName } from "./lotConstants";
import LotForm from "./LotForm";

const LotModal = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === lotModalName;
	const data = activeModal?.data || {};

	const handleSubmit = formData => {
		const formValues = { ...formData };
		formValues.yarn_quality_id = formValues?.yarn_quality_id?.value || null;
		formValues.base_manufacturer_id =
			formValues?.base_manufacturer_id?.value || null;
		formValues.jobber_id = formValues?.jobber_id?.value || null;
		formValues.parent_lot_id = formValues?.parent_lot_id?.value || null;
		if (data?.id) {
			dispatch(editMasterList(masterName, formValues, status));
		} else {
			dispatch(addMasterList(masterName, formValues, status));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(lotModalName));
	};

	const initialValues = {
		id: data.id || null,
		lot_no: data.lot_no || null,
		yarn_quality_id: data.yarn_quality
			? { label: data.yarn_quality?.name, value: data.yarn_quality?.id }
			: null,
		base_manufacturer_id: data.base_manufacturer
			? {
					label: data.base_manufacturer?.name,
					value: data.base_manufacturer?.id,
			  }
			: null,
		jobber_id: data.jobber
			? {
					label: data.jobber?.name,
					value: data.jobber?.id,
			  }
			: null,
		parent_lot_id: data.parent_lot
			? {
					label: data.parent_lot?.lot_no,
					value: data.parent_lot?.id,
			  }
			: null,
		type_of_lot: data.type_of_lot,
		status: data.status || 1,
		reject_reason: data?.reject_reason,
	};

	return (
		<Modal
			show={open}
			onHide={handleClose}
			backdrop="static"
			keyboard={false}
			centered
			size="lg"
		>
			<LotForm
				title={
					!!data?.isViewOnly ? data?.name : `${data?.id ? "Edit" : "Add"} Lot`
				}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onCancel={handleClose}
				isViewOnly={!!data?.isViewOnly}
			/>
		</Modal>
	);
};

export default LotModal;
