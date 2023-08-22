import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { addMasterList, editMasterList } from "actions/master";
import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";
import LocationForm from "./LocationForm";
import { locationModalName, masterName } from "./locationConstants";

const LocationModal = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === locationModalName;
	const data = activeModal?.data || {};

	const handleSubmit = formData => {
		const formValues = { ...formData };
		formValues.department_id = formData?.department_id?.value;
		if (data?.id) {
			dispatch(editMasterList(masterName, formValues, status));
		} else {
			dispatch(addMasterList(masterName, formValues, status));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(locationModalName));
	};
	const initialValues = {
		id: data.id || null,
		name: data.name || null,
		department_id: data?.department
			? { label: data?.department?.name, value: data?.department?.id }
			: null,
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
			<LocationForm
				title={
					!!data?.isViewOnly
						? data?.name
						: `${data?.id ? "Edit" : "Add"} Location`
				}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onCancel={handleClose}
				isViewOnly={!!data?.isViewOnly}
			/>
		</Modal>
	);
};

export default LocationModal;
