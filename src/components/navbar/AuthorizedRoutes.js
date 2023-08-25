import { CgOrganisation } from "react-icons/cg";
import { MdFormatPaint, MdRawOn, MdSpaceDashboard } from "react-icons/md";
import { Outlet, Route, Routes } from "react-router-dom";

import Dashboard from "components/dashboard/Dashboard";
import DyeingPlanning from "components/dyeing/DyeingPlanning/DyeingPlanning";
import DyeingPlanningWrapper from "components/dyeing/DyeingPlanning/DyeingPlanningWrapper";
import SaleOrder from "components/dyeing/SaleOrder/SaleOrder";
import SaleOrderFormWrapper from "components/dyeing/SaleOrder/SaleOrderWrapper";
import DyeingStock from "components/dyeing/Stock/DyeingStock";
import Count from "components/masters/count/Count";
import Denier from "components/masters/denier/Denier";
import Department from "components/masters/department/Department";
import Filament from "components/masters/filament/Filament";
import FinancialYear from "components/masters/financialYear/FinancialYear";
import Location from "components/masters/location/Location";
import Lot from "components/masters/lot/Lot";
import Party from "components/masters/party/Party";
import Process from "components/masters/process/Process";
import Shade from "components/masters/shade/Shade";
import Transport from "components/masters/transport/Transport";
import YarnQuality from "components/masters/yarnQuality/YarnQuality";
import Grn from "components/rawMaterial/Grn/Grn";
import IssueToDepartment from "components/rawMaterial/IssueToDepartment/IssueToDepartment";
import Outward from "components/rawMaterial/Outward/Outward";
import QualityCheck from "components/rawMaterial/QualityCheck/QualityCheck";
import Repacking from "components/rawMaterial/Repacking/Repacking";
import RmStock from "components/rawMaterial/Stock/RmStock";
import Wip from "components/rawMaterial/Wip/Wip";
import GrnWrapper from "components/rawMaterial/Grn/GrnWrapper";
import  {RepackingWrapper}  from "components/rawMaterial/Repacking/RepackingWrapper";
import WipWrapper from "components/rawMaterial/Wip/WipWrapper";
import QualityCheckWrapper from "components/rawMaterial/QualityCheck/QualityCheckWrapper";
import IssueToDepartmentWrapper from "components/rawMaterial/IssueToDepartment/IssueToDepartmentWrapper";
import OutwardWrapper from "components/rawMaterial/Outward/OutwardWrapper";

const getItem = (label, key, icon, children, onClick) => {
	return {
		key,
		icon,
		children,
		label,
		onClick,
	};
};

export const sidebarItemsList = [
	getItem("Dashboard", "dashboard", <MdSpaceDashboard className="fs-4" />),
	getItem("Masters", "masters", <CgOrganisation className="fs-4" />, [
		getItem("Party", "party"),
		getItem("Financial Year", "financial-year"),
		getItem("Transport", "transport"),
		getItem("Department", "department"),
		getItem("Location", "location"),
		getItem("Process", "process"),
		getItem("Denier", "denier"),
		getItem("Filament", "filament"),
		getItem("Count", "count"),
		getItem("Shade", "shade"),
		getItem("Lot", "lot"),
		getItem("Yarn Quality", "yarn-quality"),
	]),
	getItem("Raw Material", "raw-material", <MdRawOn className="fs-4" />, [
		getItem("GRN", "raw-material-grn"),
		getItem("Repacking", "raw-material-repacking"),
		getItem("WIP", "raw-material-wip"),
		getItem("Quality Check", "raw-material-quality-check"),
		getItem("Issue To Department", "raw-material-issue-to-department"),
		getItem("Outward", "raw-material-outward"),
		getItem("Stock", "raw-material-stock"),
	]),
	getItem("Dyeing", "dyeing", <MdFormatPaint className="fs-4" />, [
		getItem("Sale Order", "dyeing-sale-order/1"),
		getItem("Dyeing Planning", "dyeing-dyeing-planning/1"),
		// getItem("Repacking", "raw-material-repacking"),
		// getItem("WIP", "raw-material-wip"),
		// getItem("Quality Check", "raw-material-quality-check"),
		// getItem("Issue To Department", "raw-material-issue-to-department"),
		// getItem("Outward", "raw-material-outward"),
		getItem("Stock", "dyeing-stock"),
	]),
];

const AuthorizedRoutes = () => {
	return (
		<Routes>
			<Route path="/dashboard" element={<Dashboard />} exact />

			{/* masters routes */}
			<Route path="/financial-year/:status" element={<FinancialYear />} exact />
			<Route path="/party/:status" element={<Party />} exact />
			<Route path="/transport/:status" element={<Transport />} exact />
			<Route path="/department/:status" element={<Department />} exact />
			<Route path="/location/:status" element={<Location />} exact />
			<Route path="/process/:status" element={<Process />} exact />
			<Route path="/denier/:status" element={<Denier />} exact />
			<Route path="/filament/:status" element={<Filament />} exact />
			<Route path="/shade/:status" element={<Shade />} exact />
			<Route path="/count/:status" element={<Count />} exact />
			<Route path="/lot/:status" element={<Lot />} exact />
			<Route path="/yarn-quality/:status" element={<YarnQuality />} exact />

			{/* raw material routes */}
			{/* <Route path="/raw-material-grn/:status" element={<Grn />} exact /> */}
			<Route path="/raw-material-grn/" element={<Outlet />}>
				<Route index element={<Grn />} />
				<Route path="add" element={<GrnWrapper />} />
				<Route path=":mode/:id" element={<GrnWrapper />} />
				<Route path=":status" element={<Grn />} />
			</Route>
			{/* <Route
				path="/raw-material-repacking/:status"
				element={<Repacking />}
				exact
			/> */}
			<Route path="/raw-material-repacking/" element={<Outlet />}>
				<Route index element={<Repacking />} />
				<Route path="add" element={<RepackingWrapper />} />
				<Route path=":mode/:id" element={<RepackingWrapper />} />
				<Route path=":status" element={<Repacking />} />
			</Route>
			{/* <Route path="/raw-material-wip/:status" element={<Wip />} exact /> */}
			<Route path="/raw-material-wip/" element={<Outlet />}>
				<Route index element={<Wip />} />
				<Route path="add" element={<WipWrapper />} />
				<Route path=":mode/:id" element={<WipWrapper />} />
				<Route path=":status" element={<Wip />} />
			</Route>
			{/* <Route
				path="/raw-material-quality-check/:status"
				element={<QualityCheck />}
				exact
			/> */}
			<Route path="/raw-material-quality-check/" element={<Outlet />}>
				<Route index element={<QualityCheck />} />
				<Route path="add" element={<QualityCheckWrapper />} />
				<Route path=":mode/:id" element={<QualityCheckWrapper />} />
				<Route path=":status" element={<QualityCheck />} />
			</Route>
			{/* <Route
				path="/raw-material-issue-to-department/:status"
				element={<IssueToDepartment />}
				exact
			/> */}
			<Route path="/raw-material-issue-to-department/" element={<Outlet />}>
				<Route index element={<IssueToDepartment />} />
				<Route path="add" element={<IssueToDepartmentWrapper />} />
				<Route path=":mode/:id" element={<IssueToDepartmentWrapper />} />
				<Route path=":status" element={<IssueToDepartment />} />
				</Route>
			{/* <Route path="/raw-material-outward/:status" element={<Outward />} exact /> */}
			<Route path="/raw-material-outward/" element={<Outlet />}>
				<Route index element={<Outward />} />
				<Route path="add" element={<OutwardWrapper />} />
				<Route path=":mode/:id" element={<OutwardWrapper />} />
				<Route path=":status" element={<Outward />} />
				</Route>
			<Route
				path="/raw-material-stock/:module/:type"
				element={<RmStock />}
				exact
			/>

			{/* Dyeing department routes */}

			<Route path="/dyeing-sale-order/" element={<Outlet />}>
				<Route index element={<SaleOrder />} />
				<Route path="add" element={<SaleOrderFormWrapper />} />
				<Route path=":mode/:id" element={<SaleOrderFormWrapper />} />
				<Route path=":status" element={<SaleOrder />} />
			</Route>

			<Route path="/dyeing-dyeing-planning/" element={<Outlet />}>
				<Route index element={<DyeingPlanning />} />
				<Route path="add" element={<DyeingPlanningWrapper />} />
				<Route path=":mode/:id" element={<DyeingPlanningWrapper />} />
				<Route path=":status" element={<DyeingPlanning />} />
			</Route>

			<Route
				path="/dyeing-stock/:module/:type"
				element={<DyeingStock />}
				exact
			/>
		</Routes>
	);
};

export default AuthorizedRoutes;
