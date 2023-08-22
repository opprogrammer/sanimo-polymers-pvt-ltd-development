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
	getRepackingMasterList,
	getRepackingPagination,
} from "reducers/master";
import { convertDateToFormat } from "utils/dateUtils";
import { renderActions } from "utils/renderActions";
import { rawMaterialStatuses } from "../rawMaterialStatuses";
import RepackingModal from "./RepackingModal";
import { repackingModalName, tableName } from "./repackingConstants";

const Repacking = () => {
	const dispatch = useDispatch();
	const { status } = useParams();

	const repackingList = useSelector(getRepackingMasterList);
	const { pageSize, totalElements, currentPage } = useSelector(
		getRepackingPagination
	);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getRepackingData = useCallback(
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
	} = useMasterLogic(getRepackingData, repackingModalName);

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
											delete_repacking: true,
											update_repacked_pallet: false,
											repacked_pallet: data?.repacked_pallet?.map(rp => {
												return { ...rp, location_id: rp?.location?.id };
											}),
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
				showExport={false}
				showImport={false}
			/>
			<StatusSegments
				masterName={`raw-material-${tableName}`}
				options={rawMaterialStatuses}
			/>
			<Table
				dataSource={repackingList}
				columns={columns}
				rowKey={repackingList => repackingList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{repackingList?.length ? (
				<CustomPagination
					totalPages={Math.ceil(totalElements / pageSize)}
					itemsPerPage={pageSize}
					totalItems={totalElements}
					currentPage={currentPage}
					handlePageChange={handlePageChange}
				/>
			) : null}
			<RepackingModal />
		</>
	);
};

export default Repacking;
