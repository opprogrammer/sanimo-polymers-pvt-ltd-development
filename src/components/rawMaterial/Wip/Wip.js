import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { editMasterList, getMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import TableOptions from "components/TableOptions";
import useMasterLogic from "customHooks/useMasterLogic";
import {
	getIsFetchingMasterList,
	getWipMasterList,
	getWipPagination,
} from "reducers/master";
import { convertDateToFormat } from "utils/dateUtils";
import { useParams } from "react-router-dom";
import { renderActions } from "utils/renderActions";
//import WipModal from "./WipModal";
import { tableName, wipModalName } from "./wipConstants";

const Wip = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const wipList = useSelector(getWipMasterList);
	const { pageSize, totalElements, currentPage } =
		useSelector(getWipPagination);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getWipData = useCallback(
		(pageNum = 1, itemsPerPage = 10) => {
			dispatch(
				getMasterList(tableName, {
					page: pageNum,
					page_size: itemsPerPage,
				})
			);
		},
		[dispatch]
	);

	const { handleAddMaster, handlePageChange, handleViewMaster } =
		useMasterLogic(getWipData, null,`raw-material-${tableName}`);

	const columns = [
		{
			title: "Entry Number",
			dataIndex: "entry_no",
			key: "entry_no",
		},
		{
			title: "Entry Date",
			dataIndex: "entry_date",
			key: "entry_date",
			render: date => convertDateToFormat(date),
		},
		{
			title: "Lot Number",
			dataIndex: ["lot", "lot_no"],
			key: "lot_no",
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
			title: "Grade",
			dataIndex: "grade",
			key: "grade",
		},
		{
			title: "Total Cheese",
			dataIndex: "total_cheese",
			key: "total_cheese",
		},
		{
			title: "Total Cartons",
			dataIndex: "total_cartons",
			key: "total_cartons",
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
					{
						label: "Delete",
						onClick: () =>
							dispatch(
								editMasterList(tableName, {
									...data,
									delete_wip: true,
									update_repacked_pallet: false,
								})
							),
						type: "danger",
					},
				];

				return renderActions(items);
			},
		},
	];

	return (
		<>
			<TableOptions
				masterName={tableName}
				handleAddMaster={handleAddMaster}
				showExport={false}
				showImport={false}
			/>
			<Table
				dataSource={wipList}
				columns={columns}
				rowKey={wipList => wipList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{wipList?.length ? (
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

export default Wip;
