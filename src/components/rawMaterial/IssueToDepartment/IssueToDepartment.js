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
	getIssueToDepartmentMasterList,
	getIssueToDepartmentPagination,
} from "reducers/master";
import { convertDateToFormat } from "utils/dateUtils";
import { renderActions } from "utils/renderActions";
import { rawMaterialStatuses } from "../rawMaterialStatuses";
import IssueToDepartmentModal from "./IssueToDepartmentModal";
import {
	issueToDepartmentModalName,
	tableName,
} from "./issueToDepartmentConstants";

const IssueToDepartment = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const qualityCheckList = useSelector(getIssueToDepartmentMasterList);
	const { pageSize, totalElements, currentPage } = useSelector(
		getIssueToDepartmentPagination
	);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getIssueToDepartmentData = useCallback(
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
	} = useMasterLogic(getIssueToDepartmentData, issueToDepartmentModalName);

	const columns = [
		{
			title: "Slip Number",
			dataIndex: "slip_no",
			key: "slip_no",
		},
		{
			title: "Slip Date",
			dataIndex: "slip_date",
			key: "slip_date",
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
			title: "Quality Gradation",
			dataIndex: "quality_gradation",
			key: "quality_gradation",
		},
		{
			title: "Dyeing Gradation",
			dataIndex: "dyeing_gradation",
			key: "dyeing_gradation",
		},
		{
			title: "Department Issued",
			dataIndex: "issue_to_department",
			key: "issue_to_department",
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
						onClick: () => handleViewMaster(data),
					},
				];

				if (+status === 1)
					items.push(
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
											itd_pallet: data?.itd_pallet?.map(qp => {
												return {
													...qp,
													qc_pallet_id: qp?.qc_pallet?.id,
													location_id: qp?.location?.id,
												};
											}),
											delete_itd: true,
											update_itd_pallet: false,
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
			<IssueToDepartmentModal />
		</>
	);
};

export default IssueToDepartment;
