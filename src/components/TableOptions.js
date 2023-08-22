import { useDispatch } from "react-redux";

import { exportMasterList } from "actions/master";
import { openModal } from "actions/modal";
import { importModalName } from "components/masters/import/ImportModal";

const TableOptions = ({
	masterName,
	status,
	showAdd = true,
	showImport = true,
	showExport = true,
	handleAddMaster,
}) => {
	const dispatch = useDispatch();

	const handleImportMaster = () =>
		dispatch(openModal(importModalName, { masterName, status }));

	const handleExportMaster = () =>
		dispatch(exportMasterList(masterName, status));

	const addMaster = () => {
		handleAddMaster();
	};

	const displayName = masterName?.replace(/-/g, " ");

	return (
		<div className="d-flex flex-row justify-content-between p-1">
			{masterName && (
				<h3 style={{ textTransform: "capitalize" }}>{displayName} List</h3>
			)}
			<div className="flex-grow-1"></div>
			<>
				{showAdd && (
					<button
						className="btn ms-2 align-self-center fs-7 fw-500 bg-color-orange color-white table-btn"
						style={{
							borderRadius: 10,
						}}
						type="button"
						onClick={addMaster}
					>
						Add{" "}
						<span style={{ textTransform: "capitalize" }}>{displayName}</span>
					</button>
				)}
				{showImport && (
					<button
						className="btn ms-2 align-self-center fs-7 fw-500 bg-color-orange color-white table-btn"
						style={{ borderRadius: 10 }}
						type="button"
						onClick={handleImportMaster}
					>
						Import
					</button>
				)}
				{showExport && (
					<button
						className="btn ms-2 align-self-center fs-7 fw-500 bg-color-orange color-white table-btn"
						style={{ borderRadius: 10 }}
						type="button"
						onClick={handleExportMaster}
					>
						Export To Excel
					</button>
				)}
			</>
		</div>
	);
};

export default TableOptions;
