import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import TableOptions from "components/TableOptions";
import useMasterLogic from "customHooks/useMasterLogic";
import {
	getFinancialYearMasterList,
	getFinancialYearPagination,
	getIsFetchingMasterList,
} from "reducers/master";
import { convertDateToFormat } from "utils/dateUtils";
import { renderActions } from "utils/renderActions";
import FinancialYearModal from "./FinancialYearModal";
import { financialYearModalName, masterName } from "./financialYearConstants";

const FinancialYear = () => {
	const dispatch = useDispatch();

	const financialYearList = useSelector(getFinancialYearMasterList);
	const { pageSize, totalElements, currentPage } = useSelector(
		getFinancialYearPagination
	);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getFinancialYearData = useCallback(
		(pageNum = 1, itemsPerPage = 10) => {
			dispatch(
				getMasterList(masterName, {
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
	} = useMasterLogic(getFinancialYearData, financialYearModalName);

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Start Date",
			dataIndex: "start_date",
			key: "start_date",
			render: date => convertDateToFormat(date),
		},
		{
			title: "End Date",
			dataIndex: "end_date",
			key: "end_date",
			render: date => convertDateToFormat(date),
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
				];
				return renderActions(items);
			},
		},
	];

	return (
		<>
			<TableOptions
				masterName={masterName}
				handleAddMaster={handleAddMaster}
				showImport={false}
				showExport={false}
			/>
			<Table
				dataSource={financialYearList}
				columns={columns}
				rowKey={financialYearList => financialYearList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{financialYearList?.length ? (
				<CustomPagination
					totalPages={Math.ceil(totalElements / pageSize)}
					itemsPerPage={pageSize}
					totalItems={totalElements}
					currentPage={currentPage}
					handlePageChange={handlePageChange}
				/>
			) : null}
			<FinancialYearModal />
		</>
	);
};

export default FinancialYear;
