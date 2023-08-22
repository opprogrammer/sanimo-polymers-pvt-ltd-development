import { Button, Input, Space } from "antd";
import { useRef, useState } from "react";

import { MdSearch } from "react-icons/md";

const useSearchFilter = () => {
	const searchInput = useRef(null);
	const [tableFilters, setTableFilters] = useState({});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setTableFilters({ ...tableFilters, [dataIndex]: selectedKeys[0] });
	};

	const handleReset = (clearFilters, close) => {
		clearFilters();
		close();
		setTableFilters({});
	};

	const getColumnSearchProps = (label, dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => {
			return (
				<div
					style={{
						padding: 8,
					}}
					onKeyDown={e => e.stopPropagation()}
				>
					<Input
						ref={searchInput}
						placeholder={`Search ${label}`}
						value={selectedKeys[0]}
						onChange={e =>
							setSelectedKeys(e.target.value ? [e.target.value] : [])
						}
						onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
						style={{
							marginBottom: 8,
							display: "block",
						}}
					/>
					<Space>
						<Button
							type="primary"
							onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
							size="small"
							style={{
								width: 90,
								backgroundColor: "#f7525a",
								color: "white",
							}}
						>
							Search
						</Button>
						<Button
							onClick={() => clearFilters && handleReset(clearFilters, close)}
							size="small"
							style={{
								width: 90,
							}}
						>
							Reset
						</Button>
					</Space>
				</div>
			);
		},
		filterIcon: filtered => (
			<MdSearch
				className="fs-5"
				style={{
					color: filtered ? "#f7525a" : undefined,
				}}
			/>
		),
		onFilterDropdownOpenChange: visible => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
	});

	return { getColumnSearchProps, tableFilters };
};

export default useSearchFilter;
