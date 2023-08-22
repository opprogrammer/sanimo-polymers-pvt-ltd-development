import { Segmented } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const StatusSegments = ({ masterName, options }) => {
	const { status } = useParams();
	const navigate = useNavigate();

	return (
		<div className="d-flex justify-content-center">
			<Segmented
				className="mt-1 mb-2 fs-6"
				options={options}
				onChange={val => navigate(`/${masterName}/${val}`)}
				value={+status}
			/>
		</div>
	);
};

export default StatusSegments;
