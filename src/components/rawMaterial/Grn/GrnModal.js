import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList } from "actions/master";
import GrnForm from "./GrnForm";
import { grnModalName, tableName } from "./grnConstants";

const GrnModal = () => {
	const dispatch = useDispatch();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === grnModalName;
	const data = activeModal?.data || {};

	const handleSubmit = formData => {
		const formValues = {
			...formData,
			grn_date: formData?.grn_date?.length ? formData?.grn_date : null,
			security_inward_date: formData?.security_inward_date?.length
				? formData?.security_inward_date
				: null,
			outward_id: formData?.outward_id?.value || null,
			challan_date: formData?.challan_date?.length
				? formData?.challan_date
				: null,
			invoice_date: formData?.invoice_date?.length
				? formData?.invoice_date
				: null,
			supplier_id: formData?.supplier_id?.value || null,
			yarn_quality_id: formData?.yarn_quality_id?.value || null,
			transport_id: formData?.transport_id?.value || null,
			process_id: formData?.process_id?.value || null,
			base_manufacturer_id: formData?.base_manufacturer_id?.value || null,
			lot_id: formData?.lot_id?.value || null,
			shade_entry: formData?.shade_entry?.map(se => {
				return {
					id: se?.id || null,
					returnable_item: se?.returnable_item || null,
					returnable_item_rate: se?.returnable_item_rate || null,
					pvc_tube_weight: se?.pvc_tube_weight || null,
					pallet_no: se?.pallet_no || null,
					no_of_cheese: se?.no_of_cheese || null,
					no_of_cartons: se?.no_of_cartons || null,
					pallet_type: se?.pallet_type || null,
					color: se?.color || null,
					size: se?.size || null,
					weight: se?.weight || null,
					gross_weight: se?.gross_weight || 0,
					tare_weight: se?.tare_weight || 0,
					net_weight: se?.net_weight || null,
					api_weight: se?.api_weight || 0,
					amount: se?.amount || null,
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
		dispatch(closeModal(grnModalName));
	};

	const initialValues = {
		id: data.id || null,
		grn_no: data.grn_no || null,
		grn_date: data.grn_date || null,
		grn_type: data.grn_type || null,
		vehicle_no: data.vehicle_no || null,
		security_inward_no: data.security_inward_no || null,
		security_inward_date: data.security_inward_date || null,
		challan_no: data.challan_no || null,
		challan_date: data.challan_date || null,
		invoice_no: data.invoice_no || null,
		invoice_date: data.invoice_date || null,
		shade_no: data.shade_no || "Raw White",
		grade: data?.grade || null,
		total_cartons: data.total_cartons || null,
		total_net_weight: data.total_net_weight || null,
		rate: data.rate || null,
		total_cheese: data.total_cheese || null,
		total_amount: data.total_amount || null,
		outward_id: data.outward
			? { label: data.outward?.outward_no, value: data.outward?.id }
			: null,
		lot_id: data.lot ? { label: data.lot?.lot_no, value: data.lot?.id } : null,
		transport_id: data.transport
			? { label: data.transport?.name, value: data.transport?.id }
			: null,
		supplier_id: data.supplier
			? { label: data.supplier?.name, value: data.supplier?.id }
			: null,
		yarn_quality_id: data.yarn_quality
			? { label: data.yarn_quality?.name, value: data.yarn_quality?.id }
			: null,
		process_id: data.process
			? { label: data.process?.name, value: data.process?.id }
			: null,
		base_manufacturer_id: data.base_manufacturer
			? {
					label: data.base_manufacturer?.name,
					value: data.base_manufacturer?.id,
			  }
			: null,
		uom: data.uom || null,
		returnable_type: data.returnable_type || null,
		type_of_packing: data.type_of_packing || null,
		shade_entry: data.shade_entry || [],
		update_shade_entry: false,
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
			<GrnForm
				title={
					!!data?.isViewOnly ? data?.name : `${data?.id ? "Edit" : "Add"} GRN`
				}
				initialValues={initialValues}
				onSubmit={handleSubmit}
				onCancel={handleClose}
				isViewOnly={!!data?.isViewOnly}
			/>
		</Modal>
	);
};

export default GrnModal;
