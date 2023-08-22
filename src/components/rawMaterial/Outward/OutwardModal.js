import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList } from "actions/master";
import OutwardForm from "./OutwardForm";
import { outwardModalName, tableName } from "./outwardConstants";

const OutwardModal = () => {
	const dispatch = useDispatch();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === outwardModalName;
	const data = activeModal?.data || {};

	const handleSubmit = formData => {
		const formValues = {
			...formData,
			outward_date: formData?.outward_date?.length
				? formData?.outward_date
				: null,
			security_outward_date: formData?.security_outward_date?.length
				? formData?.security_outward_date
				: null,
			challan_date: formData?.challan_date?.length
				? formData?.challan_date
				: null,
			supplier_id: formData?.supplier_id?.value || null,
			party_id: formData?.party_id?.value || null,
			yarn_quality_id: formData?.yarn_quality_id?.value || null,
			transport_id: formData?.transport_id?.value || null,
			process_id: formData?.process_id?.value || null,
			lot_id: formData?.lot_id?.value || null,
			outward_quantity: formData?.outward_quantity?.map(oq => {
				return {
					...oq,
					id: oq?.id || null,
					outward_stock_from_id: oq?.outward_stock_from_id?.value || null,
					used_cheese: oq?.used_cheese || null,
					used_cartons: oq?.used_cartons || null,
					used_gross_weight: oq?.used_gross_weight || null,
					used_tare_weight: oq?.used_tare_weight || null,
					used_net_weight: oq?.used_net_weight || null,
				};
			}),
		};

		if (data?.id) {
			dispatch(editMasterList(tableName, formValues, 1));
		} else {
			dispatch(addMasterList(tableName, formValues, 1));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(outwardModalName));
	};

	const initialValues = {
		id: data.id || null,
		outward_no: data.outward_no || null,
		outward_date: data.outward_date || null,
		outward_type: data.outward_type || null,
		transport_id: data.transport
			? { label: data.transport?.name, value: data.transport?.id }
			: null,
		vehicle_no: data.vehicle_no || null,
		security_outward_no: data.security_outward_no || null,
		security_outward_date: data.security_outward_date || null,
		party_id: data.party
			? { label: data.party?.name, value: data.party?.id }
			: null,
		challan_no: data.challan_no || null,
		challan_date: data.challan_date || null,
		outward_stock_from: data?.outward_stock_from || null,
		lot_id: data.lot ? { label: data.lot?.lot_no, value: data.lot?.id } : null,
		shade_no: data.shade_no || "Raw White",
		grade: data?.grade || null,
		yarn_quality_id: data.yarn_quality
			? { label: data.yarn_quality?.name, value: data.yarn_quality?.id }
			: null,
		total_cheese: data.total_cheese || null,
		total_cartons: data.total_cartons || null,
		rate: data.rate || null,
		total_amount: data.total_amount || null,
		outward_quantity: data?.outward_quantity?.map(oq => {
			return {
				...oq,
				outward_stock_from_id: oq.outward_stock_from_id
					? {
							label: oq.outward_stock_from_label,
							value: oq.outward_stock_from_id,
					  }
					: null,
				pallet_entry: { ...oq },
				existing_cheese: oq?.used_cheese || 0,
				existing_net_weight: oq?.used_net_weight || 0,
			};
		}),
		update_outward_quantity: false,
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
			<OutwardForm
				title={
					!!data?.isViewOnly
						? data?.name
						: `${data?.id ? "Edit" : "Add"} Outward`
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

export default OutwardModal;
