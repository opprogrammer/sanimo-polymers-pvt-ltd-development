import { Table } from "antd";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getMasterList } from "actions/master";
import CustomPagination from "components/CustomPagination";
import useMasterLogic from "customHooks/useMasterLogic";
import {
	getIsFetchingMasterList,
	getStockMasterList,
	getStockPagination,
} from "reducers/master";
import { reset } from "redux-form";
import IssueToDyeingStockFilters, {
	formName,
} from "./IssueToDyeingStockFilters";

const tableName = "stock";

const IssueToDyeingStock = () => {
	const dispatch = useDispatch();

	const stockList = useSelector(getStockMasterList);

	const { pageSize, totalElements, currentPage } =
		useSelector(getStockPagination);
	const isFetchingMasterList = useSelector(getIsFetchingMasterList);

	const getStockData = useCallback(
		(pageNum = 1, itemsPerPage = 10, formValues) => {
			dispatch(
				getMasterList(tableName, {
					page: pageNum,
					page_size: itemsPerPage,
					list_type: "itd_pallet",
					...formValues,
				})
			);
		},
		[dispatch]
	);

	const { handlePageChange } = useMasterLogic(getStockData);

	const columns = [
		{
			title: "Slip Number",
			dataIndex: "slip_no",
			key: "slip_no",
		},
		{
			title: "Quality",
			dataIndex: "yarn_quality",
			key: "yarn_quality",
		},
		{
			title: "Shade",
			dataIndex: "shade_no",
			key: "shade_no",
			filterSearch: true,
		},
		{
			title: "Lot Number",
			dataIndex: "lot_no",
			key: "lot_no",
		},
		{
			title: "Grade",
			dataIndex: "grade",
			key: "grade",
		},
		{
			title: "Dyeing Gradation",
			dataIndex: "dyeing_gradation",
			key: "dyeing_gradation",
		},
		{
			title: "Number of Cheese",
			dataIndex: "no_of_cheese",
			key: "no_of_cheese",
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

	const handleSubmit = formData => {
		const formValues = {
			...formData,
			lot_ids: formData?.lot_ids?.map(lot => lot.value),
			yarn_quality_ids: formData?.yarn_quality_ids?.map(lot => lot.value),
		};
		getStockData(1, 10, formValues);
	};

	const handleReset = () => {
		dispatch(reset(formName));
		getStockData(1, 10);
	};

	return (
		<>
			<IssueToDyeingStockFilters
				onSubmit={handleSubmit}
				handleReset={handleReset}
			/>
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

export default IssueToDyeingStock;
