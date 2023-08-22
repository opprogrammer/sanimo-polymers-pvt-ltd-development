import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { openModal } from "actions/modal";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "reducers/user";
import usePrevious from "./usePrevious";

const useMasterLogic = (getMasterData, masterModalName, masterName = null) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { selectedCompanyId, selectedFinancialYearId } =
		useSelector(getUserDetails);
	const previousSelectedCompanyId = usePrevious(selectedCompanyId);
	const previousSelectedFinancialYearId = usePrevious(selectedFinancialYearId);

	useEffect(() => {
		getMasterData(1, 10, {});
	}, [getMasterData]);

	useEffect(() => {
		if (
			(previousSelectedCompanyId &&
				selectedCompanyId !== previousSelectedCompanyId) ||
			(previousSelectedFinancialYearId &&
				selectedFinancialYearId !== previousSelectedFinancialYearId)
		) {
			getMasterData(1, 10, {});
		}
	}, [
		selectedCompanyId,
		getMasterData,
		previousSelectedCompanyId,
		selectedFinancialYearId,
		previousSelectedFinancialYearId,
	]);

	const handleAddMaster = master => {
		masterName
			? navigate(`/${masterName}/add`)
			: dispatch(openModal(masterModalName, master));
	};

	const handleViewMaster = master => {
		masterName
			? navigate(`/${masterName}/view/${master}`)
			: dispatch(openModal(masterModalName, { ...master, isViewOnly: true }));
	};

	const handleEditMaster = master => {
		masterName
			? navigate(`/${masterName}/edit/${master}`)
			: dispatch(openModal(masterModalName, master));
	};

	const handlePageChange = (pageNum, itemsPerPage) => {
		getMasterData(pageNum, itemsPerPage);
	};

	return {
		handleAddMaster,
		handleViewMaster,
		handleEditMaster,
		handlePageChange,
	};
};

export default useMasterLogic;
