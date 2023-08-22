import { Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import GrnStock from "./GrnStock";
import QcStock from "./QcStock";
import RepackedStock from "./RepackedStock";
import WipStock from "./WipStock";

const items = [
	{
		key: "grn",
		label: `GRN Stock`,
	},
	{
		key: "repacked",
		label: `Repacked Stock`,
	},
	{
		key: "qc",
		label: `Quality Checked Stock`,
	},

	{
		key: "wip",
		label: `WIP Stock`,
	},
];

const RmStock = () => {
	const { module } = useParams();
	const navigate = useNavigate();

	const onChange = key => {
		let url = "";

		if (key === "grn") url = "grn/carton";
		else if (key === "repacked") url = "repacked/repacked_stock";
		else if (key === "qc") url = "qc/qc_stock";
		else if (key === "wip") url = "wip/wip_stock";

		navigate(`/raw-material-stock/${url}`);
	};

	const renderModule = () => {
		if (module === "grn") return <GrnStock />;
		else if (module === "repacked") return <RepackedStock />;
		else if (module === "qc") return <QcStock rootUrl="raw-material-stock" />;
		else if (module === "wip") return <WipStock />;
	};

	return (
		<>
			<Tabs
				type="card"
				defaultActiveKey={`${module}`}
				items={items}
				onChange={onChange}
			/>
			{renderModule()}
		</>
	);
};
export default RmStock;
