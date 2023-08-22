import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { editMasterList, getMasterList } from "actions/master";
import { openModal } from "actions/modal";
import CustomPagination from "components/CustomPagination";
import StatusSegments from "components/StatusSegments";
import TableOptions from "components/TableOptions";
import { rejectModalName } from "components/masters/rejectModal/RejectModal";
import useMasterLogic from "customHooks/useMasterLogic";
import {
	getDepartmentPagination,
	getIsFetchingMasterList,
	getLocationMasterList,
} from "reducers/master";
import { renderActions } from "utils/renderActions";
import { masterStatuses } from "../masterStatuses";
import LocationModal from "./LocationModal";
import { locationModalName, masterName } from "./locationConstants";

const Location = () => {
	const { status } = useParams();
	const dispatch = useDispatch();

	const locationList = useSelector(getLocationMasterList);
	const { pageSize, totalElements, currentPage } = useSelector(
		getDepartmentPagination
	);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getLocationData = useCallback(
		(pageNum = 1, itemsPerPage = 10) => {
			dispatch(
				getMasterList(masterName, {
					page: pageNum,
					page_size: itemsPerPage,
					status,
				})
			);
		},
		[status, dispatch]
	);

	const {
		handleAddMaster,
		handleEditMaster,
		handlePageChange,
		handleViewMaster,
	} = useMasterLogic(getLocationData, locationModalName);

	const columns = [
		{
			title: "Department",
			dataIndex: ["department", "name"],
			key: "department",
		},
		{
			title: "Location Name",
			dataIndex: "name",
			key: "name",
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
				// Approved && Pending
				if (+status === 1 || +status === 2)
					items.push({
						label: "Edit",
						onClick: () => handleEditMaster(data),
					});
				// Pending
				if (+status === 1)
					items.push(
						{
							label: "Approve",
							onClick: () =>
								dispatch(
									editMasterList(
										masterName,
										{ ...data, department_id: data?.department?.id, status: 2 },
										status
									)
								),
						},
						{
							label: "Reject",
							onClick: () =>
								dispatch(
									openModal(rejectModalName, {
										...data,
										department_id: data?.department?.id,
										status: 3,
										masterName,
										currentStatus: status,
									})
								),
						}
					);
				// Rejected
				if (+status === 3)
					items.push(
						{
							label: "Re-submit",
							onClick: () =>
								handleEditMaster({ ...data, reject_reason: null, status: 1 }),
						},
						{
							label: "Delete",
							onClick: () =>
								dispatch(
									editMasterList(
										masterName,
										{
											...data,
											department_id: data?.department?.id,
											is_active: false,
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

	if (+status === 3) {
		columns.splice(columns?.length - 1, 0, {
			title: "Reject Reason",
			dataIndex: "reject_reason",
			key: "reject_reason",
		});
	}

	return (
		<>
			<TableOptions
				masterName={masterName}
				handleAddMaster={handleAddMaster}
				status={status}
			/>
			<StatusSegments masterName={masterName} options={masterStatuses} />
			<Table
				dataSource={locationList}
				columns={columns}
				rowKey={locationList => locationList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{locationList?.length ? (
				<CustomPagination
					totalPages={Math.ceil(totalElements / pageSize)}
					itemsPerPage={pageSize}
					totalItems={totalElements}
					currentPage={currentPage}
					handlePageChange={handlePageChange}
				/>
			) : null}
			<LocationModal />
		</>
	);
};

export default Location;
