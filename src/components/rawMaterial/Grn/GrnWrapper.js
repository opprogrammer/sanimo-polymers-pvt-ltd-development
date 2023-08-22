//import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";

//import { closeModal } from "actions/modal";
//import { getActiveModal } from "reducers/modal";

import { addMasterList, editMasterList,getMasterDetails,resetMasterDetails } from "actions/master";
import GrnForm from "./GrnForm";
import { tableName } from "./grnConstants";
import { Spin } from "antd";
import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom/dist";
import { getGrnMasterDetails,getIsFetchingMasterDetails } from "reducers/master";


const GrnWrapper = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, id } = useParams();

	const [loading, setLoading] = useState(id ? true : false);

	const isViewOnly = mode === "view";
	const isEditing = mode === "edit";

	const grnDetails = useSelector(getGrnMasterDetails);
	const isFetchingMasterDetails = useSelector(getIsFetchingMasterDetails);

	useEffect(() => {
		if (id) {
			dispatch(getMasterDetails(tableName, id));
			setLoading(false);
		}
		return () => dispatch(resetMasterDetails(tableName));
	}, [dispatch, id]);

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

		if (grnDetails?.id) {
			dispatch(
				editMasterList(tableName, formValues, 1, "application/json", () =>
					navigate(`/raw-material-${tableName}/1`)
				)
			);
		} else {
			dispatch(
				addMasterList(tableName, formValues, 1, "application/json", () =>
					navigate(`/raw-material-${tableName}/1`)
				)
			);
		}
	};
	const handleClose = () => {
		navigate(`/raw-material-${tableName}/1`);
	};

	const initialValues = {
		id: grnDetails.id || null,
		grn_no: grnDetails.grn_no || null,
		grn_date: grnDetails.grn_date || null,
		grn_type: grnDetails.grn_type || null,
		vehicle_no: grnDetails.vehicle_no || null,
		security_inward_no: grnDetails.security_inward_no || null,
		security_inward_date: grnDetails.security_inward_date || null,
		challan_no: grnDetails.challan_no || null,
		challan_date: grnDetails.challan_date || null,
		invoice_no: grnDetails.invoice_no || null,
		invoice_date: grnDetails.invoice_date || null,
		shade_no: grnDetails.shade_no || "Raw White",
		grade: grnDetails?.grade || null,
		total_cartons: grnDetails.total_cartons || null,
		total_net_weight: grnDetails.total_net_weight || null,
		rate: grnDetails.rate || null,
		total_cheese: grnDetails.total_cheese || null,
		total_amount: grnDetails.total_amount || null,
		outward_id: grnDetails.outward
			? { label: grnDetails.outward?.outward_no, value: grnDetails.outward?.id }
			: null,
		lot_id: grnDetails.lot ? { label: grnDetails.lot?.lot_no, value: grnDetails.lot?.id } : null,
		transport_id: grnDetails.transport
			? { label: grnDetails.transport?.name, value: grnDetails.transport?.id }
			: null,
		supplier_id: grnDetails.supplier
			? { label: grnDetails.supplier?.name, value: grnDetails.supplier?.id }
			: null,
		yarn_quality_id: grnDetails.yarn_quality
			? { label: grnDetails.yarn_quality?.name, value: grnDetails.yarn_quality?.id }
			: null,
		process_id: grnDetails.process
			? { label: grnDetails.process?.name, value: grnDetails.process?.id }
			: null,
		base_manufacturer_id: grnDetails.base_manufacturer
			? {
					label: grnDetails.base_manufacturer?.name,
					value: grnDetails.base_manufacturer?.id,
			  }
			: null,
		uom: grnDetails.uom || null,
		returnable_type: grnDetails.returnable_type || null,
		type_of_packing: grnDetails.type_of_packing || null,
		shade_entry: grnDetails.shade_entry || [],
		update_shade_entry: false,
	};
	if (loading || isFetchingMasterDetails)
		return (
			<Spin
				className="h-100 d-flex justify-content-center align-items-center"
				size="large"
			/>
		);

	const title = isViewOnly
		? `Grn - ${grnDetails?.entry_no || ""}`
		: `${
				grnDetails?.id
					? `Edit Grn - ${grnDetails?.entry_no || ""}`
					: "Add Grn"
		  }`;

	return (
		<GrnForm
			title={title}
			initialValues={initialValues}
			onSubmit={handleSubmit}
			onCancel={handleClose}
			isViewOnly={isViewOnly}
			isEditing={isEditing}
		/>
	);
};

export default GrnWrapper;