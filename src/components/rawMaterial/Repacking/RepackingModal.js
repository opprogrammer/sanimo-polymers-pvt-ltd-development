import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

import { closeModal } from "actions/modal";
import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList } from "actions/master";
import { useParams } from "react-router-dom";
import RepackingForm from "./RepackingForm";
import { repackingModalName, tableName } from "./repackingConstants";

const RepackingModal = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const activeModal = useSelector(getActiveModal);
	const open = activeModal?.name === repackingModalName;
	const data = activeModal?.data || {};

	const handleSubmit = formData => {
		let repackedGrn = [];

		if (data?.id) {
			formData?.repacked_grn?.forEach(rg => {
				repackedGrn = [...repackedGrn, ...rg?.shade_entry];
			});
		} else {
			formData?.repacked_grn?.forEach(rg => {
				const grnNumber = { grn_id: rg?.grn_no?.value };
				repackedGrn = [...repackedGrn, grnNumber];
			});
		}
		const formValues = {
			...formData,
			lot_id: formData?.lot_id?.value,
			yarn_quality_id: formData?.yarn_quality_id?.value,
			repacked_grn: repackedGrn,
			repacked_pallet: formData?.repacked_pallet?.map(rp => {
				return { ...rp, location_id: rp?.location_id?.value };
			}),
		};

		if (data?.id) {
			dispatch(editMasterList(tableName, formValues, status));
		} else {
			dispatch(addMasterList(tableName, formValues, status));
		}
	};

	const handleClose = () => {
		dispatch(closeModal(repackingModalName));
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
		total_net_weight: data?.total_net_weight,
		repacked_grn:
			data?.repacked_grn?.map(rg => {
				return {
					entry_type: rg?.entry_type,
					shade_entry: rg.shade_entry,
					grn_no: rg?.grn_no,
					total_cheese: rg?.total_cheese,
					total_cartons: rg?.total_cartons,
					total_net_weight: rg?.total_net_weight,
				};
			}) || [],
		repacked_pallet:
			data?.repacked_pallet?.map(rp => {
				return {
					id: rp?.id,
					pallet_no: rp?.pallet_no,
					location_id: rp?.location
						? {
								label: rp?.location?.name,
								value: rp?.location?.id,
						  }
						: null,
					no_of_cheese: rp?.no_of_cheese,
					no_of_cartons: rp?.no_of_cartons,
					gross_weight: rp?.gross_weight,
					tare_weight: rp?.tare_weight,
					net_weight: rp?.net_weight,
					average_weight: rp?.average_weight,
				};
			}) || [],
		update_repacked_pallet: false,
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
			<RepackingForm
				title={
					!!data?.isViewOnly
						? data?.name
						: `${data?.id ? "Edit" : "Add"} Repacking`
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

export default RepackingModal;
