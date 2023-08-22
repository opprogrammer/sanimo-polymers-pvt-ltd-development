import { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import { Field, FieldArray } from "redux-form";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";
import { renderShadeList } from "../Repacking/renderShadeList";

export const renderOutwardStock = ({
	fields,
	metaData,
	fetchPallet,
	fetchShadeList,
	updateAvgWeight,
	isFetchingDropdown,
	errorsData,
	isViewOnly,
	yarnQuality,
	lotNumber,
	shadeNumber,
	grade,
	outwardStockFrom,
	outwardQuantity,
	isEditing,
	meta: { submitFailed, error },
}) => {
	return (
		<div className="d-flex align-items-center justify-content-center flex-column">
			<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-2">
				<h4 className="text-start">Outward Entry</h4>
				{!isEditing && (
					<button
						className="mt-2 btn btn-primary"
						type="button"
						onClick={() => fields.unshift({})}
						disabled={
							!yarnQuality ||
							!lotNumber ||
							!shadeNumber ||
							!grade ||
							!outwardStockFrom
						}
					>
						Add Outward Entry
					</button>
				)}
			</div>
			{fields?.length === 0 && (
				<>
					<h6 className="m-3">
						No outward entry added. Click on Add Outward Entry button to add
						one.
					</h6>
				</>
			)}
			{fields.map((outward_quantity, index) => {
				const netWeight = +outwardQuantity?.[index]?.used_net_weight || 0;
				const noOfCheese = +outwardQuantity?.[index]?.used_cheese || 0;

				return (
					<Fragment key={index}>
						<div className="d-flex justify-content-center align-items-center w-100">
							<div className="align-self-start w-100">
								<Row>
									{outwardStockFrom === "GRN" && (
										<Col className="mb-1">
											<Field
												component={ReduxFormAsyncSelect}
												label="GRN"
												name={`${outward_quantity}.outward_stock_from_id`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.outward_quantity?.[index]
														?.outward_stock_from_id?.touched
												}
												error={
													errorsData?.outward_quantity?.[index]
														?.outward_stock_from_id
												}
												masterDropdownName="grn"
												status={1}
												onChange={({ value }) =>
													fetchShadeList(value, index, "grn")
												}
												query={{
													yarn_quality_id: yarnQuality?.value,
													lot_id: lotNumber?.value,
													shade_no: shadeNumber,
													grade: grade,
												}}
												isSubForm={true}
											/>
										</Col>
									)}
									{outwardStockFrom === "Repacking" && (
										<Col className="mb-1">
											<Field
												component={ReduxFormAsyncSelect}
												label="Repacked Pallet"
												name={`${outward_quantity}.outward_stock_from_id`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.outward_quantity?.[index]
														?.outward_stock_from_id?.touched
												}
												error={
													errorsData?.outward_quantity?.[index]
														?.outward_stock_from_id
												}
												masterDropdownName="stock"
												onChange={({ value }) =>
													fetchPallet(value, index, "repacked_pallet")
												}
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
									)}
									{outwardStockFrom === "QC" && (
										<Col className="mb-1">
											<Field
												component={ReduxFormAsyncSelect}
												label="QC Pallet"
												name={`${outward_quantity}.outward_stock_from_id`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.outward_quantity?.[index]
														?.outward_stock_from_id?.touched
												}
												error={
													errorsData?.outward_quantity?.[index]
														?.outward_stock_from_id
												}
												masterDropdownName="stock"
												onChange={({ value }) =>
													fetchPallet(value, index, "qc_pallet")
												}
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
								{outwardStockFrom === "GRN" && (
									<FieldArray
										name={`${outward_quantity}.shade_entry`}
										component={renderShadeList}
										shadeList={outwardQuantity?.[index]?.shade_entry}
									/>
								)}
								{(outwardStockFrom === "Repacking" ||
									outwardStockFrom === "QC") &&
									outwardQuantity?.[index]?.pallet_entry && (
										<div
											className="text-nowrap pb-2"
											style={{ overflowX: "auto" }}
										>
											{outwardStockFrom === "QC" && (
												<div className="mb-1 subform-table-item">
													<label className="fw-500">
														Original No of Cheese
													</label>
													<input
														className="form-control"
														value={
															outwardQuantity?.[index]?.original_no_of_cheese
														}
														disabled
													/>
												</div>
											)}
											<div className="mb-1 subform-table-item">
												<label className="fw-500">
													{outwardStockFrom === "QC"
														? "Current No of Cheese"
														: "Number of Cheese"}
												</label>
												<input
													className="form-control"
													value={outwardQuantity?.[index]?.total_cheese}
													disabled
												/>
											</div>
											<div className="mb-1 subform-table-item">
												<label className="fw-500">Number of Cartons</label>
												<input
													className="form-control"
													value={outwardQuantity?.[index]?.total_cartons}
													disabled
												/>
											</div>
											{outwardStockFrom === "QC" && (
												<div className="mb-1 subform-table-item">
													<label className="fw-500">Original Net Weight</label>
													<input
														className="form-control"
														value={
															outwardQuantity?.[index]?.original_net_weight
														}
														disabled
													/>
												</div>
											)}
											<div className="mb-1 subform-table-item">
												<label className="fw-500">
													{outwardStockFrom === "QC"
														? "Current Net Weight"
														: "Net Weight"}
												</label>
												<input
													className="form-control"
													value={
														outwardQuantity?.[index]?.pallet_entry?.net_weight
													}
													disabled
												/>
											</div>
											<div className="mb-1 subform-table-item">
												<label className="fw-500">Average Weight</label>
												<input
													className="form-control"
													value={
														outwardQuantity?.[index]?.pallet_entry
															?.average_weight
													}
													disabled
												/>
											</div>
											{outwardStockFrom === "QC" && (
												<>
													<div className="mb-1 subform-table-item">
														<label className="fw-500">Used Cheese</label>
														<Field
															component={ReduxFormTextField}
															type="number"
															onWheel={e => onWheelHandler(e)}
															name={`${outward_quantity}.used_cheese`}
															className=""
															onChange={e => {
																updateAvgWeight(
																	index,
																	e.target.value,
																	netWeight
																);
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
															name={`${outward_quantity}.used_cartons`}
															className=""
															placeholder="Enter Used Cartons"
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
															name={`${outward_quantity}.used_gross_weight`}
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
															name={`${outward_quantity}.used_net_weight`}
															onChange={e => {
																updateAvgWeight(
																	index,
																	noOfCheese,
																	e.target.value
																);
															}}
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
															name={`${outward_quantity}.used_tare_weight`}
															disabled={isViewOnly}
														/>
													</div>
													<div className="mb-1 subform-table-item">
														<label className="fw-500">
															Used Average Weight
														</label>
														<Field
															component={ReduxFormTextField}
															type="number"
															onWheel={e => onWheelHandler(e)}
															className=""
															name={`${outward_quantity}.used_average_weight`}
															disabled
														/>
													</div>
													<Field
														component="input"
														name="existing_cheese"
														hidden
													/>
													<Field
														component="input"
														name="existing_net_weight"
														hidden
													/>
												</>
											)}
										</div>
									)}
							</div>
						</div>
						<hr className="w-100 my-2" />
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
