import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { editMasterList, getMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import StatusSegments from "components/StatusSegments";
import TableOptions from "components/TableOptions";
import useMasterLogic from "customHooks/useMasterLogic";
import { useParams } from "react-router-dom";
import {
	getIsFetchingMasterList,
	getQualityCheckMasterList,
	getQualityCheckPagination,
} from "reducers/master";
import { convertDateToFormat } from "utils/dateUtils";
import { renderActions } from "utils/renderActions";
import { rawMaterialStatuses } from "../rawMaterialStatuses";
import QualityCheckModal from "./QualityCheckModal";
import { qualityCheckModalName, tableName } from "./qualityCheckConstants";

const QualityCheck = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const qualityCheckList = useSelector(getQualityCheckMasterList);
	const { pageSize, totalElements, currentPage } = useSelector(
		getQualityCheckPagination
	);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getQualityCheckData = useCallback(
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
	} = useMasterLogic(getQualityCheckData, null,`raw-material-${tableName}`);

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
				];

				if (+status === 1 || +status === 2)
					items.push(
						{
							label: "Edit",
							onClick: () => handleEditMaster(data?.id),
						},
						{
							label: "Delete",
							onClick: () =>
								dispatch(
									editMasterList(
										tableName,
										{
											...data,
											qc_pallet: data?.qc_pallet?.map(qp => {
												return {
													...qp,
													location_id: qp?.location?.id,
												};
											}),
											delete_qc: true,
											update_qc_pallet: false,
										},
										status
									)
								),
							type: "danger",
						}
					);

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
			
		</>
	);
};

export default QualityCheck;
