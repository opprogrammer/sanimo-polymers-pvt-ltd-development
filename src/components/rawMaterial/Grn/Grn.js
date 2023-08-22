import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMasterList,editMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import TableOptions from "components/TableOptions";
import useMasterLogic from "customHooks/useMasterLogic";
import {
	getGrnMasterList,
	getGrnPagination,
	getIsFetchingMasterList,
} from "reducers/master";
import { renderActions } from "utils/renderActions";

import StatusSegments from "components/StatusSegments";
import { useParams } from "react-router-dom";
import { rawMaterialStatuses } from "../rawMaterialStatuses";
//import GrnModal from "./GrnModal";
import { grnModalName, tableName } from "./grnConstants";
//import { convertDateToFormat } from "utils/dateUtils";

const Grn = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const grnList = useSelector(getGrnMasterList);
	const { pageSize, totalElements, currentPage } =
		useSelector(getGrnPagination);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getGrnData = useCallback(
		(pageNum = 1, itemsPerPage = 10) => {
			dispatch(
				getMasterList(tableName, {
					page: pageNum,
					page_size: itemsPerPage,
					status,
				})
			);
		},
		[dispatch, status]
	);

	const {
		handleAddMaster,
		handleEditMaster,
		handlePageChange,
		handleViewMaster,
	} = useMasterLogic(getGrnData, null,`raw-material-${tableName}`);

	const columns = [
		{
			title: "GRN Number",
			dataIndex: "grn_no",
			key: "grn_no",
		},
		{
			title: "GRN Type",
			dataIndex: "grn_type",
			key: "grn_type",
		},
		{
			title: "Supplier Name",
			dataIndex: ["supplier", "name"],
			key: "supplier",
		},
		{
			title: "Lot Number",
			dataIndex: ["lot", "lot_no"],
			key: "lot_no",
		},
		{
			title: "Grade",
			dataIndex: "grade",
			key: "grade",
		},
		{
			title: "Quality Name",
			dataIndex: ["yarn_quality", "name"],
			key: "yarn_quality",
		},
		{
			title: "Shade Number",
			dataIndex: "shade_no",
			key: "shade_no",
		},
		{
			title: "Total Cheese",
			dataIndex: "total_cheese",
			key: "total_cheese",
		},
		{
			title: "Total Amount",
			dataIndex: "total_amount",
			key: "total_amount",
		},
		{
			title: "Actions",
			key: "Actions",
			dataIndex: "action",
			render: (_, data) => {
				const items = [
					{
						label: "View",
						onClick: () => handleViewMaster(data?.id),
					},
				];

				if (+status === 1 || +status === 2)
					items.push({
						label: "Edit",
						onClick: () => handleEditMaster(data?.id),
					});

					if (+status === 1 || +status === 2)
					items.push({
						label: +status === 1 ? "Cancel" : "Pre Close",
						onClick: () =>
							dispatch(
								editMasterList(
									tableName,
									{
										...data,
										grn_date: data?.grn_date?.length ? data?.grn_date : null,
			security_inward_date: data?.security_inward_date?.length
				? data?.security_inward_date
				: null,
			outward_id: data?.outward_id?.value || null,
			challan_date: data?.challan_date?.length
				? data?.challan_date
				: null,
			invoice_date: data?.invoice_date?.length
				? data?.invoice_date
				: null,
			supplier_id: data?.supplier_id?.value || null,
			yarn_quality_id: data?.yarn_quality_id?.value || null,
			transport_id: data?.transport_id?.value || null,
			process_id: data?.process_id?.value || null,
			base_manufacturer_id: data?.base_manufacturer_id?.value || null,
			lot_id: data?.lot_id?.value || null,
			shade_entry: data?.shade_entry?.map(se => {
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
										
									},
									status
								)
							),
					});

				return renderActions(items);
			},
		},
	];

	return (
		<>
			<TableOptions
				masterName={tableName}
				handleAddMaster={handleAddMaster}
				showImport={false}
				showExport={false}
			/>
			<StatusSegments
				masterName={`raw-material-${tableName}`}
				options={rawMaterialStatuses}
			/>
			<Table
				dataSource={grnList}
				columns={columns}
				rowKey={grnList => grnList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{grnList?.length ? (
				<CustomPagination
					totalPages={Math.ceil(totalElements / pageSize)}
					itemsPerPage={pageSize}
					totalItems={totalElements}
					currentPage={currentPage}
					handlePageChange={handlePageChange}
				/>
			) : null}
			
		</>
	);
};

export default Grn;
