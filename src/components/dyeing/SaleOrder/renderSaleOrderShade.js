import { Field } from "redux-form";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";

import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";

const columnsList = [
	"Shade",
	"Party Ref Shade Number",
	"Order Quantity(Net Wt.)",
	"Net Wt. With Tolerance",
	"Est. Delivery Date",
];

export const renderSaleOrderShade = ({
	fields,
	isFetchingDropdown,
	metaData,
	errorsData,
	isViewOnly,
	yarnQuality,
	estimateDeliveryDate,
	addDisabled,
	updateToleranceWeight,
	fetchReferenceName,
	meta: { submitFailed, error },
}) => {
	return (
		<>
			<hr className="mt-2 mb-0" />
			<div className="d-flex flex-column">
				<div className="d-flex flex-row align-items-center justify-content-around w-100 my-2">
					<h4 className="text-start">Sale Order Shades</h4>
					{!isViewOnly && (
						<button
							className="mt-2 mb-2 btn btn-primary align-self-center"
							type="button"
							onClick={() =>
								fields.unshift({
									id: null,
									est_delivery_date: estimateDeliveryDate,
								})
							}
							disabled={addDisabled}
						>
							Add Sale Order Shades
						</button>
					)}
				</div>
				<div className="mx-auto">
					{fields?.length === 0 ? (
						<>
							<h6 className="m-2 align-self-center">
								No Sale Order Shade entry added. Click on Add Sale Order Shade
								button to add one.
							</h6>
						</>
					) : (
						<>
							<div className="text-nowrap">
								{columnsList.map(label => (
									<label key={label} className="subform-table-item fw-500">
										{label}
									</label>
								))}
							</div>
							<div
								className="h-100"
								style={{ overflowY: "auto", maxHeight: "50vh" }}
							>
								{fields.map((sale_order_shade, index) => {
									return (
										<div key={index} className="text-nowrap">
											<div className="mb-1 subform-table-item">
												<Field
													component={ReduxFormAsyncSelect}
													name={`${sale_order_shade}.shade_id`}
													disabled={isFetchingDropdown || isViewOnly}
													onChange={e =>
														fetchReferenceName(false, e?.value, index)
													}
													className="mt-1"
													touched={
														metaData?.sale_order_shade?.[index]?.shade_id
															?.touched
													}
													error={
														errorsData?.sale_order_shade?.[index]?.shade_id
													}
													placeholder="Shade"
													masterDropdownName="shade"
													menuPosition="fixed"
													query={{ yarn_quality_id: yarnQuality?.value }}
													isSubForm={true}
												/>
											</div>
											<div className="mb-1 subform-table-item">
												<Field
													name={`${sale_order_shade}.party_ref_shade_no`}
													maxLength={200}
													className="mt-1"
													component={ReduxFormTextField}
													placeholder="Party Ref. Shade Number"
													disabled={isViewOnly}
												/>
											</div>
											<div className="mb-1 subform-table-item">
												<Field
													name={`${sale_order_shade}.net_weight`}
													component={ReduxFormTextField}
													className="mt-1"
													type="number"
													onWheel={e => onWheelHandler(e)}
													onChange={e => {
														updateToleranceWeight(index, e.target.value);
													}}
													placeholder="Net Weight"
													disabled={isViewOnly}
												/>
											</div>
											<div className="mb-1 subform-table-item">
												<Field
													name={`${sale_order_shade}.net_weight_with_tolerance`}
													component={ReduxFormTextField}
													className="mt-1"
													type="number"
													onWheel={e => onWheelHandler(e)}
													disabled
												/>
											</div>
											<div className="mb-1 subform-table-item">
												<Field
													name={`${sale_order_shade}.est_delivery_date`}
													component={ReduxFormTextField}
													type="date"
													max="9999-12-31"
													className="mt-1"
													placeholder="Enter Estimate Delivery Date"
													disabled={isViewOnly}
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
									);
								})}
							</div>
						</>
					)}
				</div>
				{submitFailed && error && (
					<span className="text-center ms-2 mb-2" style={{ color: "red" }}>
						{error}
					</span>
				)}
			</div>
		</>
	);
};
