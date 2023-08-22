import { Tabs } from "antd";
import QcStock from "components/rawMaterial/Stock/QcStock";
import { useNavigate, useParams } from "react-router-dom";
import IssueToDyeingStock from "./IssueToDyeingStock";

const items = [
	{
		key: "qc",
		label: `RM - Quality Checked Stock`,
	},
	{
		key: "itd_pallet",
		label: `Dyeing Stock`,
	},
];

const DyeingStock = () => {
	const { module } = useParams();
	const navigate = useNavigate();

	const onChange = key => {
		let url = "";

		if (key === "qc") url = "qc/qc_stock";
		else if (key === "itd_pallet") url = "itd_pallet/slip";
		// else if (key === "repacked") url = "repacked/repacked_stock";
		// else if (key === "wip") url = "wip/wip_stock";

		navigate(`/dyeing-stock/${url}`);
	};

	const renderModule = () => {
		if (module === "qc") return <QcStock rootUrl="dyeing-stock" />;
		else if (module === "itd_pallet") return <IssueToDyeingStock />;
		// else if (module === "wip") return <WipStock />;
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
export default DyeingStock;
