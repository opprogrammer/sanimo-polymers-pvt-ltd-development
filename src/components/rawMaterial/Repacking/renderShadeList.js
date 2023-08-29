import { Fragment } from "react";

export const renderShadeList = ({ shadeList }) => {
	return (
		<div className="d-flex flex-column" style={{ overflowX: "auto" }}>
			{shadeList?.length && (
				<div className="text-nowrap">
					{[
						"Number of Cheese",
						"Number of Cartons",
						"Gross Weight",
						"Tare Weight",
						"Net Weight",
						"Average Weight",
					].map(label => (
						<label key={label} className="form-label subform-table-item3 fw-500">
							{label}
						</label>
					))}
				</div>
			)}
			{shadeList?.map((shade_entry, index) => {
				return (
					<Fragment key={index}>
						<div className="text-nowrap mb-2">
							<div className="mb-3 subform-table-item3">
								<input
									className="form-control"
									value={shade_entry?.no_of_cheese}
									disabled
								/>
							</div>
							<div className="mb-3 subform-table-item3">
								<input
									className="form-control"
									value={shade_entry?.no_of_cartons}
									disabled
								/>
							</div>
							<div className="mb-3 subform-table-item3">
								<input
									className="form-control"
									value={shade_entry?.gross_weight}
									disabled
								/>
							</div>
							<div className="mb-3 subform-table-item3">
								<input
									className="form-control"
									value={shade_entry?.tare_weight}
									disabled
								/>
							</div>
							<div className="mb-3 subform-table-item3">
								<input
									className="form-control"
									value={shade_entry?.net_weight}
									disabled
								/>
							</div>
							<div className="mb-3 subform-table-item3">
								<input
									className="form-control"
									value={shade_entry?.average_weight}
									disabled
								/>
							</div>
						</div>
					</Fragment>
				);
			})}
		</div>
	);
};
