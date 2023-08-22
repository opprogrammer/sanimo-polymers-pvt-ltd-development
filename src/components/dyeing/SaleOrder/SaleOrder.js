import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { editMasterList, getMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import TableOptions from "components/TableOptions";
import useMasterLogic from "customHooks/useMasterLogic";
import {
	getIsFetchingMasterList,
	getSaleOrderMasterList,
	getSaleOrderPagination,
} from "reducers/master";
import { renderActions } from "utils/renderActions";

import StatusSegments from "components/StatusSegments";
import { useParams } from "react-router-dom";
import { convertDateToFormat } from "utils/dateUtils";
import { saleOrderStatuses, tableName } from "./saleOrderConstants";

const SaleOrder = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const saleOrderList = useSelector(getSaleOrderMasterList);
	const { pageSize, totalElements, currentPage } = useSelector(
		getSaleOrderPagination
	);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getSaleOrderData = useCallback(
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
		handleViewMaster,
		handleEditMaster,
		handlePageChange,
	} = useMasterLogic(getSaleOrderData, null, `dyeing-${tableName}`);

	const columns = [
		{
			title: "Order Number",
			dataIndex: "order_no",
			key: "order_no",
		},
		{
			title: "Order Date",
			dataIndex: "order_date",
			key: "order_date",
			render: date => convertDateToFormat(date),
		},
		{
			title: "Party Name",
			dataIndex: ["party", "name"],
			key: "name",
		},
		{
			title: "Quality Name",
			dataIndex: ["yarn_quality", "name"],
			key: "yarn_quality",
		},
		{
			title: "Grade",
			dataIndex: "grade",
			key: "grade",
		},
		{
			title: "Process",
			dataIndex: ["process", "name"],
			key: "process",
		},
		{
			title: "Order By",
			dataIndex: "order_by",
			key: "order_by",
		},
		{
			title: "Total Order Quantity(Net Wt.)",
			dataIndex: "total_net_weight",
			key: "total_net_weight",
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
										est_delivery_date: data?.est_delivery_date?.length
											? data?.est_delivery_date
											: null,
										party_id: data?.party?.id || null,
										party_delivery_id: data?.party_delivery?.id || null,
										yarn_quality_id: data?.yarn_quality?.id || null,
										grade: data?.grade || null,
										process_id: data?.process?.id || null,
										sale_order_shade: data?.sale_order_shade?.map(sos => {
											return {
												...sos,
												shade_id: sos?.shade?.id || null,
											};
										}),
										cancel_sale_order: true,
										update_sale_order_shade: false,
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
				showImport={false}
				showExport={false}
				handleAddMaster={handleAddMaster}
			/>
			<StatusSegments
				masterName={`dyeing-${tableName}`}
				options={saleOrderStatuses}
			/>
			<Table
				dataSource={saleOrderList}
				columns={columns}
				rowKey={saleOrderList => saleOrderList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{saleOrderList?.length ? (
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

export default SaleOrder;
