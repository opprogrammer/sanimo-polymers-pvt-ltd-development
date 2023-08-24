import { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import { Field } from "redux-form";
import { ReduxFormAsyncSelectShade } from "utils/shadeField";

export const renderWipPalletForm = ({
	fields,
	isFetchingDropdown,
	errorsData,
	metaData,
	isViewOnly,
	entryType,
	yarnQuality,
	lotNumber,
	shadeNumber,
	grade,
	wipPallet,
	isEditing,
	fetchPallet,
	meta: { submitFailed, error },
}) => {
	return (
		<div className="d-flex flex-column">
			<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-2">
				<h4 className="text-start">Wip Pallet</h4>
				{(!isEditing && !isViewOnly) && (
					<button
						className="mt-2 btn btn-primary"
						type="button"
						onClick={() => fields.unshift({})}
						disabled={!yarnQuality || !lotNumber || !shadeNumber || !grade}
					>
						Add WIP Pallet
					</button>
				)}
			</div>
			{fields?.length === 0 && (
				<>
					<h6 className="m-2 text-center">
						No WIP pallet added. Click on Add WIP Pallet button to add one.
					</h6>
				</>
			)}
			<>
					<div
						className="h-100"
						style={{ overflowY: "auto", maxHeight: "70vh"}}
					>
			{fields.map((wip_pallet, index) => {
				return (
					<Fragment key={index}>
						<div className="d-flex justify-content-center align-items-center w-100">
							<div className="align-self-start w-100">
								<Row>
									{ (entryType === "repacked_pallet") ?  (
										<Col className="mb-1">
											<Field
												component={ReduxFormAsyncSelectShade}
												label="Repacked Pallet"
												name={`${wip_pallet}.entry_id`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.wip_pallet?.[index]?.entry_id?.touched
												}
												error={errorsData?.wip_pallet?.[index]?.entry_id}
												placeholder="Select Repacked Pallet"
												masterDropdownName="stock"
												onChange={({ value }) =>
													fetchPallet(value, index, "repacked_pallet")
												}
												status={1}
												query={{
													list_type: "repacked_pallet",
													yarn_quality_id: yarnQuality?.value,
													lot_id: lotNumber?.value,
													shade_no: shadeNumber,
													grade: grade,
												}}
												isSubForm={true}
											/>
										</Col>
									) : (!isEditing && !isViewOnly) &&(
										<Col className="mb-1">
											<Field
												component={ReduxFormAsyncSelectShade}
												label="QC Pallet"
												name={`${wip_pallet}.entry_id`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.wip_pallet?.[index]?.entry_id?.touched
												}
												error={errorsData?.wip_pallet?.[index]?.entry_id}
												placeholder="Select QC Pallet"
												masterDropdownName="stock"
												onChange={({ value }) =>
													fetchPallet(value, index, "qc_pallet")
												}
												status={1}
												query={{
													list_type: "qc_pallet",
													yarn_quality_id: yarnQuality?.value,
													lot_id: lotNumber?.value,
													shade_no: shadeNumber,
													grade: grade,
												}}
												isSubForm={true}
											/>
										</Col>
									)}
									{/* {(isEditing || isViewOnly) && (
										<Col >
											<div className="subform-table-item">
												<label className="form-label">{`${wip_pallet?.[index]?.entry_id}`}</label>
												<input
													className="form-control"
													value={wip_pallet?.[index]?.entry_id}
													disabled
												/>
											</div>
										</Col>
									)} */}
									
									<Col>
									{wipPallet?.[index]?.pallet_entry && (
									<div className="text-nowrap" style={{ overflowX: "auto" }}>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Number of Cheese</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.no_of_cheese}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Number of Cartons</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.no_of_cartons}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Net Weight</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.net_weight}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Average Weight</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.average_weight}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Location</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.location?.name}
												disabled
											/>
										</div>
									</div>
								)}
								</Col>
									{(!isEditing && !isViewOnly) && (
										<Col className="align-self-center mt-2">
											<button
												className="me-2 btn btn-danger"
												type="button"
												onClick={() => fields.remove(index)}
											>
												Remove
											</button>
										</Col>
									)}
									<Col></Col>
									<Col></Col>
									
								</Row>
								{/* {wipPallet?.[index]?.pallet_entry && (
									<div className="text-nowrap" style={{ overflowX: "auto" }}>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Number of Cheese</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.no_of_cheese}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Number of Cartons</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.no_of_cartons}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Net Weight</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.net_weight}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Average Weight</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.average_weight}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Location</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.location?.name}
												disabled
											/>
										</div>
									</div>
								)} */}
							</div>
						</div>
						<hr className="w-100 m-2" />
					</Fragment>
				);
			})}
			</div>
			</>
			{submitFailed && error && (
				<span className="text-center ms-2 mb-2" style={{ color: "red" }}>
					{error}
				</span>
			)}
		</div>
	);
};
