import { Fragment } from "react";
import { Field } from "redux-form";
import { ReduxFormSelectField } from "utils/ReduxFormSelectField";

import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";
import {
	dyeingGradationOptions,
	qualityGradationOptions,
} from "./qualityCheckConstants";

export const renderQcPallet = ({
	fields,
	isViewOnly,
	disableQcButton,
	qcPallet,
	wipStock,
	updateAvgWeight,
	isEditing,
	errorsData,
	metaData,
	isFetchingDropdown,
	meta: { submitFailed, error },
}) => {
	const columnsList = [
		"Quality Gradation",
		"Dyeing Gradation",
		"Number of Cheese",
		"Number of Cartons",
		"Gross Weight",
		"Tare Weight",
		"Net Weight",
		"Average Weight",
		"Location",
	];

	if (isEditing) columnsList?.unshift("Pallet Number");

	return (
		<>
			<hr className="w-100 m-1" />
			{wipStock?.length ? (
				<>
					<div className="d-flex flex-row align-items-center justify-content-center my-2 w-100">
						<h5 className="text-start">Current Stock in WIP</h5>
					</div>
					<div className="text-nowrap mb-1 d-flex justify-content-center">
						<div className="mb-1 subform-table-item">
							<label className="fw-500">Number of Cheese</label>
							<input
								className="form-control"
								value={wipStock?.[0]?.no_of_cheese}
								disabled
							/>
						</div>
						<div className="mb-1 subform-table-item">
							<label className="fw-500">Number of Cartons</label>
							<input
								className="form-control"
								value={wipStock?.[0]?.no_of_cartons}
								disabled
							/>
						</div>
						<div className="mb-1 subform-table-item">
							<label className="fw-500">Net Weight</label>
							<input
								className="form-control"
								value={wipStock?.[0]?.net_weight}
								disabled
							/>
						</div>
						<div className="mb-1 subform-table-item">
							<label className="fw-500">Average Weight</label>
							<input
								className="form-control"
								value={wipStock?.[0]?.average_weight}
								disabled
							/>
						</div>
					</div>
					<hr className="w-100 m-1" />
				</>
			) : null}
			<div className="d-flex flex-column pb-1" style={{ overflowX: "auto" }}>
				<div className="d-flex flex-row align-items-center justify-content-around w-100 my-2">
					<h4 className="text-start">QC Pallets</h4>
					{(!isEditing && !isViewOnly) && (
						<button
							className="mt-2 mb-2 btn btn-primary align-self-center"
							type="button"
							onClick={() =>
								fields.unshift({
									id: null,
								})
							}
							disabled={disableQcButton}
						>
							Add QC Pallet
						</button>
					)}
				</div>
				{fields?.length === 0 ? (
					<>
						<h6 className="m-3 align-self-center">
							No QC entry added. Click on Add QC Pallet button to add one.
						</h6>
					</>
				) : (
					fields?.length && (
						<div className="text-nowrap">
							{columnsList.map(label => (
								<label key={label} className="subform-table-item fw-500 mb-2">
									{label}
								</label>
							))}
						</div>
					)
				)}
				{fields.map((qc_pallet, index) => {
					const netWeight = +qcPallet?.[index]?.net_weight || 0;
					const noOfCheese = +qcPallet?.[index]?.no_of_cheese || 0;
					return (
						<Fragment key={index}>
							<div className="text-nowrap">
								{(isEditing && isViewOnly) && (
									<div className="mb-1 subform-table-item">
										<Field
											name={`${qc_pallet}.pallet_no`}
											component={ReduxFormTextField}
											className="mt-1"
											disabled
										/>
									</div>
								)}
								<div className="mb-1 subform-table-item">
									<Field
										component={ReduxFormSelectField}
										name={`${qc_pallet}.quality_gradation`}
										className="mt-1"
										options={qualityGradationOptions}
										disabled={isViewOnly}
										touched={
											metaData?.qc_pallet?.[index]?.quality_gradation?.touched
										}
										error={errorsData?.qc_pallet?.[index]?.quality_gradation}
										menuPosition="fixed"
										isSubForm={true}
									/>
								</div>
								<div className="mb-1 subform-table-item">
									<Field
										component={ReduxFormSelectField}
										name={`${qc_pallet}.dyeing_gradation`}
										className="mt-1"
										options={dyeingGradationOptions}
										disabled={isViewOnly}
										touched={
											metaData?.qc_pallet?.[index]?.dyeing_gradation?.touched
										}
										error={errorsData?.qc_pallet?.[index]?.dyeing_gradation}
										menuPosition="fixed"
										isSubForm={true}
									/>
								</div>
								<div className="mb-1 subform-table-item">
									<Field
										name={`${qc_pallet}.no_of_cheese`}
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
								<div className="mb-1 subform-table-item">
									<Field
										name={`${qc_pallet}.no_of_cartons`}
										component={ReduxFormTextField}
										className="mt-1"
										type="number"
										onWheel={e => onWheelHandler(e)}
										placeholder="Number of Carton/Pallet"
										disabled={isViewOnly}
									/>
								</div>
								<div className="mb-1 subform-table-item">
									<Field
										name={`${qc_pallet}.gross_weight`}
										component={ReduxFormTextField}
										className="mt-1"
										type="number"
										onWheel={e => onWheelHandler(e)}
										placeholder="Gross Weight"
										disabled={isViewOnly}
									/>
								</div>
								<div className="mb-1 subform-table-item">
									<Field
										name={`${qc_pallet}.tare_weight`}
										component={ReduxFormTextField}
										className="mt-1"
										type="number"
										onWheel={e => onWheelHandler(e)}
										placeholder="Tare weight"
										disabled={isViewOnly}
									/>
								</div>
								<div className="mb-1 subform-table-item">
									<Field
										name={`${qc_pallet}.net_weight`}
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
								<div className="mb-1 subform-table-item">
									<Field
										name={`${qc_pallet}.average_weight`}
										component={ReduxFormTextField}
										className="mt-1"
										type="number"
										onWheel={e => onWheelHandler(e)}
										placeholder="Average weight"
										disabled
									/>
								</div>
								<div className="mb-1 subform-table-item">
									<Field
										component={ReduxFormAsyncSelect}
										className="mt-1"
										name={`${qc_pallet}.location_id`}
										disabled={isFetchingDropdown || isViewOnly}
										touched={metaData?.qc_pallet?.[index]?.location_id?.touched}
										error={errorsData?.qc_pallet?.[index]?.location_id}
										placeholder="Select Location"
										masterDropdownName="location"
										menuPosition="fixed"
										isSubForm={true}
									/>
								</div>
								{(!isEditing && !isViewOnly) && (
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
		</>
	);
};
