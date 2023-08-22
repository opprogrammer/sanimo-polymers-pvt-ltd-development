import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { editMasterList, getMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import TableOptions from "components/TableOptions";
import useMasterLogic from "customHooks/useMasterLogic";
import {
	getDyeingPlanningMasterList,
	getDyeingPlanningPagination,
	getIsFetchingMasterList,
} from "reducers/master";
import { renderActions } from "utils/renderActions";

import StatusSegments from "components/StatusSegments";
import { useParams } from "react-router-dom";
import { convertDateToFormat } from "utils/dateUtils";
import { dyeingPlanningStatuses, tableName } from "./dyeingPlanningConstants";

const DyeingPlanning = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const dyeingPlanningList = useSelector(getDyeingPlanningMasterList);
	const { pageSize, totalElements, currentPage } = useSelector(
		getDyeingPlanningPagination
	);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getDyeingPlanningData = useCallback(
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
	} = useMasterLogic(getDyeingPlanningData, null, `dyeing-${tableName}`);

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
			title: "Machine Number",
			dataIndex: "machine_no",
			key: "machine_no",
		},
		{
			title: "Lot No",
			dataIndex: ["lot", "lot_no"],
			key: "lot_no",
		},
		{
			title: "Ordered Quality Name",
			dataIndex: ["ordered_yarn_quality", "name"],
			key: "ordered_yarn_quality",
		},
		{
			title: "Quality Name",
			dataIndex: ["yarn_quality", "name"],
			key: "yarn_quality",
		},
		{
			title: "Shade",
			dataIndex: ["shade", "shade_no"],
			key: "shade",
		},
		{
			title: "Total Planned Qty",
			dataIndex: "total_planned_net_weight",
			key: "total_planned_net_weight",
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
				options={dyeingPlanningStatuses}
			/>
			<Table
				dataSource={dyeingPlanningList}
				columns={columns}
				rowKey={dyeingPlanningList => dyeingPlanningList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{dyeingPlanningList?.length ? (
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

export default DyeingPlanning;
