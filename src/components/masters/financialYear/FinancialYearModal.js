import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { addMasterList, editMasterList } from "actions/master";
import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";
import FinancialYearForm from "./FinancialYearForm";
import { financialYearModalName, masterName } from "./financialYearConstants";

const FinancialYearModal = () => {
	const dispatch = useDispatch();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === financialYearModalName;
	const data = activeModal?.data || {};

	const handleSubmit = formData => {
		if (data?.id) {
			dispatch(editMasterList(masterName, formData));
		} else {
			dispatch(addMasterList(masterName, formData));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(financialYearModalName));
	};
	const initialValues = {
		id: data.id || null,
		name: data.name || null,
		start_date: data.start_date || null,
		end_date: data.end_date || null,
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
			<FinancialYearForm
				title={
					!!data?.isViewOnly
						? data?.name
						: `${data?.id ? "Edit" : "Add"} Financial Year`
				}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onCancel={handleClose}
				isViewOnly={!!data?.isViewOnly}
			/>
		</Modal>
	);
};

export default FinancialYearModal;
