import { Fragment, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Field } from "redux-form";

import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";
import { returnableItemOptions } from "./grnConstants";
import { ReduxFormTextFieldShade,ReduxFormAsyncSelectShade,ReduxFormSelectFieldShade } from "utils/shadeField";


export const renderShadeEntry = ({
	fields,
	metaData,
	isFetchingDropdown,
	errorsData,
	isViewOnly,
	shadeEntry,
	updateAmount,
	updateAvgWeight,
	isReturnable = false,
	typeOfPacking,
	meta: { submitFailed, error },
}) => {
	return (
		<div className="d-flex mt-5 justify-content-center flex-column absolute">
			<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-1">
				<h4 className="text-start">Shade Entry</h4>
				{!isViewOnly && (
					<button
						className="mt-2 btn btn-primary"
						type="button"
						onClick={() =>
							fields.unshift({
								id: null,
								amount: 0,
								api_weight: 0,
								average_weight: 0,
								gross_weight: null,
								tare_weight: null,
								returnable_item: null,
								returnable_item_rate: null,
								color: null,
								size: null,
								weight: null,
								pallet_type: null,
								pallet_no: null,
							})
						}
					>
						Add Shade Entry
					</button>
				)}
			</div>

			

			{fields?.length === 0 && (
				<>
					<h6 className="m-3 text-center">
						No shade entry added. Click on Add Shade Entry button to add one.
					</h6>
					{submitFailed && error && (
						<span style={{ color: "red", marginLeft: "4px" }}>{error}</span>
					)}
					
				</>
			)}
			
		<>
		<div
						className="h-100"
						style={{ overflowY: "auto", maxHeight: "50vh"}}
					>
				
			
			
			{fields.map((shade_entry, index) => {
				const netWeight = +shadeEntry?.[index]?.net_weight || 0;
				const noOfCheese = +shadeEntry?.[index]?.no_of_cheese || 0;
				const returnableItem = shadeEntry?.[index]?.returnable_item || [];
			

				return (
					<>
					<Fragment key={index} >
						<div className="d-flex align-items-center w-100 ">
							<div className="align-self-start w-100">
								<Row>
									<Col className="mb-1 ">
										<Field
											label="Number of Carton/Pallet"
											name={`${shade_entry}.no_of_cartons`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Number of Carton/Pallet"
											disabled={isViewOnly}
										/>
									</Col>
									<Col className="mb-1 ">
										<Field
											label="Number of Cheese"
											name={`${shade_entry}.no_of_cheese`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Number of Cheese"
											onChange={e =>{
												updateAvgWeight(index, e.target.value, netWeight);
											}}
											disabled={isViewOnly}
										/>
									</Col>
									{typeOfPacking === "Pallet" && (
										<Col className="mb-1">
											<Field
												label="Pallet Number"
												maxLength={30}
												name={`${shade_entry}.pallet_no`}
												component={ReduxFormTextFieldShade}
												placeholder="Pallet Number"
												disabled={isViewOnly}
											/>
										</Col>
									)}
									<Col className="mb-1">
										<Field
											label="Gross Weight"
											name={`${shade_entry}.gross_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Gross Weight"
											disabled={isViewOnly}
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="Tare Weight"
											name={`${shade_entry}.tare_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Tare weight"
											disabled={isViewOnly}
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="Net Weight"
											name={`${shade_entry}.net_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											onChange={e => {
												updateAmount(index, e.target.value);
												updateAvgWeight(index, noOfCheese, e.target.value);
											}}
											placeholder="Net Weight"
											disabled={isViewOnly}
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="Average Weight"
											name={`${shade_entry}.average_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Average weight"
											disabled
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="API Weight"
											name={`${shade_entry}.api_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="API weight"
											disabled
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="Amount"
											name={`${shade_entry}.amount`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Amount"
											disabled
										/>
									</Col>
								</Row>
								{/* <Row>
									<Col className="mb-1">
										<Field
											label="Tare Weight"
											name={`${shade_entry}.tare_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Tare weight"
											disabled={isViewOnly}
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="Net Weight"
											name={`${shade_entry}.net_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											onChange={e => {
												updateAmount(index, e.target.value);
												updateAvgWeight(index, noOfCheese, e.target.value);
											}}
											placeholder="Net Weight"
											disabled={isViewOnly}
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="Average Weight"
											name={`${shade_entry}.average_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Average weight"
											disabled
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="API Weight"
											name={`${shade_entry}.api_weight`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="API weight"
											disabled
										/>
									</Col>
									<Col className="mb-1">
										<Field
											label="Amount"
											name={`${shade_entry}.amount`}
											component={ReduxFormTextFieldShade}
											type="number"
											onWheel={e => onWheelHandler(e)}
											placeholder="Amount"
											disabled
										/>
									</Col>
								</Row> */}
								<Row>
									{isReturnable && (
										<>
											<Col className="mb-1">
												<Field
													component={ReduxFormSelectFieldShade}
													name={`${shade_entry}.returnable_item`}
													label="Returnable Item"
													className="mt-2"
													disabled={isFetchingDropdown || isViewOnly}
													options={returnableItemOptions}
													touched={
														metaData?.shade_entry?.[index]?.returnable_item
															?.touched
													}
													error={
														errorsData?.shade_entry?.[index]?.returnable_item
													}
													placeholder="Returnable Item"
													isMulti
													isSubForm={true}
												/>
											</Col>
											<Col className="mb-1">
												<Field
													label="Returnable Item Rate"
													name={`${shade_entry}.returnable_item_rate`}
													component={ReduxFormTextFieldShade}
													type="number"
													onWheel={e => onWheelHandler(e)}
													placeholder="Returnable Item Rate"
													disabled={isViewOnly}
												/>
											</Col>
											{returnableItem.includes("Pallet") && (
												<Col className="mb-1">
													<Field
														label="Pallet Type"
														maxLength={50}
														name={`${shade_entry}.pallet_type`}
														component={ReduxFormTextFieldShade}
														placeholder="Pallet Type"
														disabled={isViewOnly}
													/>
												</Col>
											)}
										</>
									)}
								</Row>
								{isReturnable &&
									(returnableItem.includes("Carton") ||
										returnableItem.includes("PVC Tube")) && (
										<Row>
											<Col className="mb-1">
												<Field
													label="Color"
													maxLength={50}
													name={`${shade_entry}.color`}
													component={ReduxFormTextFieldShade}
													placeholder="Color"
													disabled={isViewOnly}
												/>
											</Col>
											<Col className="mb-1">
												<Field
													label="Size"
													maxLength={50}
													name={`${shade_entry}.size`}
													component={ReduxFormTextFieldShade}
													placeholder="Size"
													disabled={isViewOnly}
												/>
											</Col>
											<Col className="mb-1">
												<Field
													label="Weight"
													name={`${shade_entry}.weight`}
													component={ReduxFormTextFieldShade}
													type="number"
													onWheel={e => onWheelHandler(e)}
													placeholder="Weight"
													disabled={isViewOnly}
												/>
											</Col>
										</Row>
									)}
							</div>
							{!isViewOnly && (
								<div className="ms-3 mt-2">
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
						
						<hr className="w-100 m-4" />
						
						
					</Fragment>
				
				</>
				);
				
			})
			}
			</div>
			
		</>
			</div>
			
	
	);

	
};
