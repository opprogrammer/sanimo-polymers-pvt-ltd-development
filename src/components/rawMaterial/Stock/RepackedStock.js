import { Segmented, Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import useMasterLogic from "customHooks/useMasterLogic";
import useSearchFilter from "customHooks/useSearchFilter";
import { useNavigate, useParams } from "react-router-dom";
import {
	getIsFetchingMasterList,
	getStockMasterList,
	getStockPagination,
} from "reducers/master";

const tableName = "stock";

const RepackedStock = () => {
	const { type } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const stockList = useSelector(getStockMasterList);

	const { pageSize, totalElements, currentPage } =
		useSelector(getStockPagination);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const { getColumnSearchProps, tableFilters } = useSearchFilter();

	const getStockData = useCallback(
		(pageNum = 1, itemsPerPage = 10) => {
			dispatch(
				getMasterList(tableName, {
					page: pageNum,
					page_size: itemsPerPage,
					list_type: type,
					...tableFilters,
				})
			);
		},
		[dispatch, type, tableFilters]
	);

	const { handlePageChange } = useMasterLogic(getStockData);

	const columns = [
		{
			title: "Quality",
			dataIndex: "yarn_quality",
			key: "yarn_quality",
			...getColumnSearchProps("Yarn Quality", "yarn_quality"),
		},
		{
			title: "Shade",
			dataIndex: "shade_no",
			key: "shade_no",
			filterSearch: true,
			...getColumnSearchProps("Shade Number", "shade_no"),
		},
		{
			title: "Lot Number",
			dataIndex: "lot_no",
			key: "lot_no",
			...getColumnSearchProps("Lot Number", "lot_no"),
		},
		{
			title: "Grade",
			dataIndex: "grade",
			key: "grade",
			...getColumnSearchProps("Grade", "grade"),
		},
		{
			title: "Cheese Quantity",
			dataIndex: "no_of_cheese",
			key: "no_of_cheese",
		},
		{
			title: "Number of Cartons",
			dataIndex: "no_of_cartons",
			key: "no_of_cartons",
		},
		{
			title: "Net Weight",
			dataIndex: "net_weight",
			key: "net_weight",
		},
		{
			title: "Average Weight",
			render: (_, data) =>
				(data?.net_weight / data?.no_of_cheese).toFixed(4) || 0,
		},
	];

	if (type === "repacked_pallet") {
		columns.splice(0, 0, {
			title: "Pallet Number",
			dataIndex: "pallet_no",
			key: "pallet_no",
			...getColumnSearchProps("Pallet Number", "pallet_no"),
		});
	}

	return (
		<>
			<div className="d-flex justify-content-center">
				<Segmented
					className="mt-1 mb-2 fs-6"
					options={[
						{ label: "Summary", value: "repacked_stock" },
						{ label: "Pallet", value: "repacked_pallet" },
					]}
					value={type}
					onChange={val => navigate(`/raw-material-stock/repacked/${val}`)}
				/>
			</div>
			<Table
				dataSource={stockList}
				columns={columns}
				rowKey={stockList => stockList?.id}
				pagination={false}
				loading={isFetchingMasterList}
				bordered
			/>
			{stockList?.length ? (
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

export default RepackedStock;
