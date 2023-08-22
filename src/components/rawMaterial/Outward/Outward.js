import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { editMasterList, getMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import TableOptions from "components/TableOptions";
import useMasterLogic from "customHooks/useMasterLogic";
import {
	getIsFetchingMasterList,
	getOutwardMasterList,
	getOutwardPagination,
} from "reducers/master";
import { convertDateToFormat } from "utils/dateUtils";
import { renderActions } from "utils/renderActions";
import OutwardModal from "./OutwardModal";
import { outwardModalName, tableName } from "./outwardConstants";

const Outward = () => {
	const dispatch = useDispatch();

	const qualityCheckList = useSelector(getOutwardMasterList);
	const { pageSize, totalElements, currentPage } =
		useSelector(getOutwardPagination);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getOutwardData = useCallback(
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

	const {
		handleAddMaster,
		handleEditMaster,
		handlePageChange,
		handleViewMaster,
	} = useMasterLogic(getOutwardData, outwardModalName);

	const columns = [
		{
			title: "Outward Number",
			dataIndex: "outward_no",
			key: "outward_no",
		},
		{
			title: "Outward Date",
			dataIndex: "outward_date",
			key: "outward_date",
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
			title: "Shade",
			dataIndex: "shade_no",
			key: "shade_no",
		},
		{
			title: "Grade",
			dataIndex: "grade",
			key: "grade",
		},
		{
			title: "Outward Type",
			dataIndex: "outward_type",
			key: "outward_type",
		},
		{
			title: "Outward Stock From",
			dataIndex: "outward_stock_from",
			key: "outward_stock_from",
		},
		{
			title: "Total Cheese",
			dataIndex: "total_cheese",
			key: "total_cheese",
		},
		{
			title: "Rate",
			dataIndex: "rate",
			key: "rate",
		},
		{
			title: "Total Cartons",
			dataIndex: "total_cartons",
			key: "total_cartons",
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
						onClick: () => handleViewMaster(data),
					},
					{
						label: "Edit",
						onClick: () => handleEditMaster(data),
					},
					{
						label: "Delete",
						onClick: () =>
							dispatch(
								editMasterList(
									tableName,
									{
										...data,
										transport_id: data?.transport?.id || null,
										party_id: data?.party?.id || null,
										outward_quantity: data?.outward_quantity?.map(qp => {
											return {
												...qp,
											};
										}),
										delete_outward: true,
										update_outward_quantity: false,
									},
									1
								)
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
				showImport={false}
				showExport={false}
			/>
			<Table
				dataSource={qualityCheckList}
				columns={columns}
				rowKey={qualityCheckList => qualityCheckList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{qualityCheckList?.length ? (
				<CustomPagination
					totalPages={Math.ceil(totalElements / pageSize)}
					itemsPerPage={pageSize}
					totalItems={totalElements}
					currentPage={currentPage}
					handlePageChange={handlePageChange}
				/>
			) : null}
			<OutwardModal />
		</>
	);
};

export default Outward;
