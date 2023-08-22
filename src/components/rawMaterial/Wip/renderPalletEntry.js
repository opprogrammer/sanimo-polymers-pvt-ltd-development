import { Fragment } from "react";

export const renderPalletEntry = ({ pallet }) => {
	return (
		<div className="d-flex flex-column" style={{ overflowX: "auto" }}>
			{!!pallet && (
				<Fragment>
					<div className="text-nowrap">
						{[
							"Pallet Number",
							"Gross Weight",
							"Net Weight",
							"Tare Weight",
							"Average Weight",
							"Number of Cartons",
							"Number of Cheese",
							"Location",
						].map(label => (
							<label key={label} className="form-label subform-table-item">
								{label}
							</label>
						))}
					</div>

					<div className="text-nowrap">
						<div className="mb-3 subform-table-item">
							<input
								className="form-control"
								value={pallet?.pallet_no}
								disabled
							/>
						</div>
						<div className="mb-3 subform-table-item">
							<input
								className="form-control"
								value={pallet?.gross_weight}
								disabled
							/>
						</div>
						<div className="mb-3 subform-table-item">
							<input
								className="form-control"
								value={pallet?.net_weight}
								disabled
							/>
						</div>
						<div className="mb-3 subform-table-item">
							<input
								className="form-control"
								value={pallet?.tare_weight}
								disabled
							/>
						</div>
						<div className="mb-3 subform-table-item">
							<input
								className="form-control"
								value={pallet?.average_weight}
								disabled
							/>
						</div>
						<div className="mb-3 subform-table-item">
							<input
								className="form-control"
								value={pallet?.no_of_cheese}
								disabled
							/>
						</div>
						<div className="mb-3 subform-table-item">
							<input
								className="form-control"
								value={pallet?.no_of_cartons}
								disabled
							/>
						</div>
						<div className="mb-3 subform-table-item">
							<input
								className="form-control"
								value={pallet?.location?.name}
								disabled
							/>
						</div>
					</div>
				</Fragment>
			)}
		</div>
	);
};
