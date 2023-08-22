import { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import { Field } from "redux-form";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";

export const renderItdPallet = ({
	fields,
	metaData,
	isFetchingDropdown,
	errorsData,
	isViewOnly,
	itdPallet,
	yarnQuality,
	lotNumber,
	shadeNumber,
	grade,
	qualityGradation,
	dyeingGradation,
	fetchQcPallet,
	isEditing,
	updateAvgWeight,
	meta: { submitFailed, error },
}) => {
	return (
		<div className="d-flex align-items-center justify-content-center flex-column">
			<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-2">
				<h4 className="text-start">Issue to Department Pallets</h4>
				{!isEditing && (
					<button
						className="mt-2 btn btn-primary"
						type="button"
						onClick={() => fields.unshift({ id: null })}
						disabled={
							!yarnQuality ||
							!lotNumber ||
							!shadeNumber ||
							!grade ||
							!qualityGradation
						}
					>
						Add Pallets
					</button>
				)}
			</div>
			{fields?.length === 0 && (
				<>
					<h6 className="m-2">
						No pallets added. Click on Add Pallets button to add one.
					</h6>
				</>
			)}
			{fields.map((itd_pallet, index) => {
				const netWeight = +itdPallet?.[index]?.used_net_weight || 0;
				const noOfCheese = +itdPallet?.[index]?.used_cheese || 0;
				return (
					<Fragment key={index}>
						<div className="d-flex justify-content-center align-items-center w-100">
							<div className="align-self-start w-100">
								<Row>
									{!isEditing && (
										<Col className="mb-2">
											<Field
												component={ReduxFormAsyncSelect}
												label="QC Pallet"
												name={`${itd_pallet}.qc_pallet_id`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.itd_pallet?.[index]?.qc_pallet_id?.touched
												}
												error={errorsData?.itd_pallet?.[index]?.qc_pallet_id}
												placeholder="Select QC Pallet"
												masterDropdownName="stock"
												status={1}
												onChange={({ value }) => fetchQcPallet(value, index)}
												query={{
													list_type: "qc_pallet",
													yarn_quality_id: yarnQuality?.value,
													lot_id: lotNumber?.value,
													shade_no: shadeNumber,
													grade: grade,
													quality_gradation: qualityGradation,
													dyeing_gradation: dyeingGradation,
												}}
												isSubForm={true}
											/>
										</Col>
									)}
									{isEditing && (
										<Col className="mb-2">
											<div className="mb-1 subform-table-item">
												<label className="fw-500">Pallet Number</label>
												<input
													className="form-control"
													value={itdPallet?.[index]?.qc_pallet?.pallet_no}
													disabled
												/>
											</div>
										</Col>
									)}
									{!isEditing && (
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
								</Row>
								<div className="text-nowrap pb-2" style={{ overflowX: "auto" }}>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Original No of Cheese</label>
										<input
											className="form-control"
											value={
												itdPallet?.[index]?.qc_pallet?.original_no_of_cheese
											}
											disabled
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Current No of Cheese</label>
										<input
											className="form-control"
											value={itdPallet?.[index]?.qc_pallet?.no_of_cheese}
											disabled
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Number of Cartons</label>
										<input
											className="form-control"
											value={itdPallet?.[index]?.qc_pallet?.no_of_cartons}
											disabled
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Original Net Weight</label>
										<input
											className="form-control"
											value={itdPallet?.[index]?.qc_pallet?.original_net_weight}
											disabled
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Current Net Weight</label>
										<input
											className="form-control"
											value={itdPallet?.[index]?.qc_pallet?.net_weight}
											disabled
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Average Weight</label>
										<input
											className="form-control"
											value={itdPallet?.[index]?.qc_pallet?.average_weight}
											disabled
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Location</label>
										<input
											className="form-control"
											value={itdPallet?.[index]?.qc_pallet?.location?.name}
											disabled
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Used Cheese</label>
										<Field
											component={ReduxFormTextField}
											type="number"
											className=""
											onWheel={e => onWheelHandler(e)}
											name={`${itd_pallet}.used_cheese`}
											placeholder="Enter Total Cheese"
											onChange={e => {
												updateAvgWeight(index, e.target.value, netWeight);
											}}
											disabled={isViewOnly}
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Used Cartons</label>
										<Field
											component={ReduxFormTextField}
											type="number"
											onWheel={e => onWheelHandler(e)}
											name={`${itd_pallet}.used_cartons`}
											className=""
											placeholder="Enter Total Cartons"
											disabled={isViewOnly}
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Used Gross Weight</label>
										<Field
											component={ReduxFormTextField}
											type="number"
											onWheel={e => onWheelHandler(e)}
											className=""
											name={`${itd_pallet}.used_gross_weight`}
											placeholder="Enter Used Gross Weight"
											disabled={isViewOnly}
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Used Tare Weight</label>
										<Field
											component={ReduxFormTextField}
											type="number"
											onWheel={e => onWheelHandler(e)}
											className=""
											name={`${itd_pallet}.used_tare_weight`}
											placeholder="Enter Used Tare Weight"
											disabled={isViewOnly}
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Used Net Weight</label>
										<Field
											component={ReduxFormTextField}
											type="number"
											onWheel={e => onWheelHandler(e)}
											className=""
											name={`${itd_pallet}.used_net_weight`}
											onChange={e => {
												updateAvgWeight(index, noOfCheese, e.target.value);
											}}
											placeholder="Enter Used Net Weight"
											disabled={isViewOnly}
										/>
									</div>
									<div className="mb-1 subform-table-item">
										<label className="fw-500">Used Average Weight</label>
										<Field
											component={ReduxFormTextField}
											type="number"
											onWheel={e => onWheelHandler(e)}
											className=""
											name={`${itd_pallet}.used_average_weight`}
											placeholder="Enter Used Average Weight"
											disabled
										/>
									</div>
									<Field component="input" name="existing_cheese" hidden />
									<Field component="input" name="existing_net_weight" hidden />
								</div>
							</div>
						</div>
						<hr className="my-2" />
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
