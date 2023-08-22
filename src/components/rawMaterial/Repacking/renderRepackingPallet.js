import { Fragment } from "react";
import { Field } from "redux-form";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";

import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";

export const renderRepackingPallet = ({
	fields,
	isViewOnly,
	disableRepackButton,
	repackedPallet,
	updateAvgWeight,
	isEditing,
	isFetchingDropdown,
	metaData,
	errorsData,
	meta: { submitFailed, error },
}) => {
	const columnsList = [
		"Number of Cheese",
		"Number of Cartons",
		"Gross Weight",
		"Tare Weight",
		"Net Weight",
		"Location",
		"Average Weight",
	];

	if (isEditing) columnsList?.unshift("Pallet Number");

	return (
		<div className="d-flex flex-column pb-1" style={{ overflowX: "auto" }}>
			<div className="d-flex flex-row align-items-center justify-content-around w-100 my-2">
				<h4 className="text-start">Repacking Pallets</h4>
				{!isEditing && (
					<button
						className="mt-2 mb-2 btn btn-primary align-self-center"
						type="button"
						onClick={() =>
							fields.unshift({
								id: null,
							})
						}
						disabled={disableRepackButton}
					>
						Add Repacking Pallet
					</button>
				)}
			</div>
			{fields?.length === 0 ? (
				<>
					<h6 className="m-2 align-self-center">
						No repacking pallet entry added. Click on Add Repacking Pallet
						button to add one.
					</h6>
				</>
			) : (
				fields?.length && (
					<div className="text-nowrap">
						{columnsList.map(label => (
							<label
								key={label}
								className="form-label subform-table-item fw-500"
							>
								{label}
							</label>
						))}
					</div>
				)
			)}
			{fields.map((repacked_pallet, index) => {
				const netWeight = +repackedPallet?.[index]?.net_weight || 0;
				const noOfCheese = +repackedPallet?.[index]?.no_of_cheese || 0;
				return (
					<Fragment key={index}>
						<div className="text-nowrap">
							{isEditing && (
								<div className="subform-table-item">
									<Field
										name={`${repacked_pallet}.pallet_no`}
										className="mt-1"
										component={ReduxFormTextField}
										disabled
									/>
								</div>
							)}
							<div className="subform-table-item">
								<Field
									name={`${repacked_pallet}.no_of_cheese`}
									component={ReduxFormTextField}
									className="mt-1"
									type="number"
									onWheel={e => onWheelHandler(e)}
									placeholder="Number of Cheese"
									onChange={e =>
										updateAvgWeight(index, e.target.value, netWeight)
									}
									disabled={isViewOnly}
								/>
							</div>
							<div className="subform-table-item">
								<Field
									name={`${repacked_pallet}.no_of_cartons`}
									component={ReduxFormTextField}
									className="mt-1"
									type="number"
									onWheel={e => onWheelHandler(e)}
									placeholder="Number of Carton/Pallet"
									disabled={isViewOnly}
								/>
							</div>
							<div className="subform-table-item">
								<Field
									name={`${repacked_pallet}.gross_weight`}
									component={ReduxFormTextField}
									className="mt-1"
									type="number"
									onWheel={e => onWheelHandler(e)}
									placeholder="Gross Weight"
									disabled={isViewOnly}
								/>
							</div>
							<div className="subform-table-item">
								<Field
									name={`${repacked_pallet}.tare_weight`}
									component={ReduxFormTextField}
									className="mt-1"
									type="number"
									onWheel={e => onWheelHandler(e)}
									placeholder="Tare weight"
									disabled={isViewOnly}
								/>
							</div>
							<div className="subform-table-item">
								<Field
									name={`${repacked_pallet}.net_weight`}
									component={ReduxFormTextField}
									className="mt-1"
									type="number"
									onWheel={e => onWheelHandler(e)}
									onChange={e => {
										updateAvgWeight(index, noOfCheese, e.target.value);
									}}
									placeholder="Net Weight"
									disabled={isViewOnly}
								/>
							</div>
							<div className="subform-table-item">
								<Field
									component={ReduxFormAsyncSelect}
									name={`${repacked_pallet}.location_id`}
									className="mt-1"
									disabled={isFetchingDropdown || isViewOnly}
									touched={metaData?.location_id?.touched}
									error={errorsData?.location_id}
									placeholder="Select Location"
									masterDropdownName="location"
									menuPosition="fixed"
									isSubForm={true}
								/>
							</div>
							<div className="subform-table-item">
								<Field
									name={`${repacked_pallet}.average_weight`}
									component={ReduxFormTextField}
									className="mt-1"
									type="number"
									onWheel={e => onWheelHandler(e)}
									placeholder="Average weight"
									disabled
								/>
							</div>
							{!isViewOnly && (
								<div className="d-inline-block ms-3 me-2">
									<button
										className="me-2 btn btn-danger"
										type="button"
										onClick={() => fields.remove(index)}
									>
										Remove
									</button>
								</div>
							)}
						</div>
					</Fragment>
				);
			})}
			{submitFailed && error && (
				<span className="text-center ms-2 mb-2" style={{ color: "red" }}>
					{error}
				</span>
			)}
		</div>
	);
};
