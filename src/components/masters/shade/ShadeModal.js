import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { addMasterList, editMasterList } from "actions/master";
import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { masterName, shadeModalName } from "./shadeConstants";
import ShadeForm from "./ShadeForm";

const ShadeModal = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === shadeModalName;
	const data = activeModal?.data || {};

	const handleSubmit = formData => {
		const formValues = { ...formData };
		formValues.yarn_quality = formValues.yarn_quality.map(yq => yq.value);
		formValues.party_shade_reference_no =
			formValues?.party_shade_reference_no?.map(psr => {
				return { ...psr, party_id: psr?.party_id?.value };
			});

		if (data?.id) {
			dispatch(editMasterList(masterName, formValues, status));
		} else {
			dispatch(addMasterList(masterName, formValues, status));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(shadeModalName));
	};
	const initialValues = {
		id: data.id || null,
		shade_no: data.shade_no || null,
		yarn_quality:
			data?.yarn_quality?.map(yq => {
				return { label: yq?.name, value: yq?.id };
			}) || null,
		party_shade_reference_no:
			data.party_shade_reference_no?.map(psr => {
				return {
					id: psr?.id,
					party_id: psr.party
						? { label: psr.party?.name, value: psr.party?.id }
						: null,
					party_shade_reference: psr?.party_shade_reference,
				};
			}) || [],
		status: data.status || 1,
		reject_reason: data?.reject_reason,
		update_yarn_quality: false,
		update_party_shade_reference_no: false,
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
			<ShadeForm
				title={
					!!data?.isViewOnly ? data?.name : `${data?.id ? "Edit" : "Add"} Shade`
				}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onCancel={handleClose}
				isViewOnly={!!data?.isViewOnly}
			/>
		</Modal>
	);
};

export default ShadeModal;
