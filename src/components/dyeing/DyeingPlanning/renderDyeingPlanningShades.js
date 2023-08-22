import { Fragment } from "react";
import { Field } from "redux-form";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";

const columnsList = [
	"Sale Order Number",
	"Party Name",
	"Estimated Delivery Date",
	"Pending Qty",
	"Planned Qty",
];

export const renderDyeingPlanningShades = ({
	fields,
	metaData,
	errorsData,
	isViewOnly,
	isEditing,
	disableFetch,
	fetchSaleOrderShadeList,
	dyeingPlanningSos,
	meta: { submitFailed, error },
}) => {
	return (
		<div className="d-flex align-items-center justify-content-center flex-column">
			<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-2">
				<h4 className="text-start">Shade List</h4>
				{!isViewOnly && !isEditing && (
					<button
						className="mt-2 btn btn-primary"
						type="button"
						onClick={fetchSaleOrderShadeList}
						disabled={disableFetch}
					>
						Fetch Shade List
					</button>
				)}
			</div>
			{fields?.length === 0 ? (
				<>
					<h6 className="m-2">
						No shades added. Click on Fetch Shade List button to add.
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
						{fields.map((dyeing_planning_sos, index) => {
							return (
								<Fragment key={index}>
									<div className="d-flex justify-content-center align-items-center w-100">
										<div className="align-self-start w-100">
											<div
												className="text-nowrap pb-2"
												style={{ overflowX: "auto" }}
											>
												<div className="mb-1 subform-table-item">
													<input
														className="form-control"
														value={
															dyeingPlanningSos?.[index]?.sale_order?.order_no
														}
														disabled
													/>
												</div>
												<div className="mb-1 subform-table-item">
													<input
														className="form-control"
														value={dyeingPlanningSos?.[index]?.party?.name}
														disabled
													/>
												</div>
												<div className="mb-1 subform-table-item">
													<input
														className="form-control"
														value={
															dyeingPlanningSos?.[index]?.est_delivery_date
														}
														disabled
													/>
												</div>
												<div className="mb-1 subform-table-item">
													<input
														className="form-control"
														value={
															dyeingPlanningSos?.[index]?.pending_net_weight
														}
														disabled
													/>
												</div>
												<div className="mb-1 subform-table-item">
													<Field
														component={ReduxFormTextField}
														type="number"
														onWheel={e => onWheelHandler(e)}
														className=""
														name={`${dyeing_planning_sos}.planned_net_weight`}
														placeholder="Enter Planned Qty"
														disabled={isViewOnly}
													/>
												</div>
											</div>
										</div>
									</div>
								</Fragment>
							);
						})}
					</div>
				</>
			)}
			{submitFailed && error && (
				<span className="text-center ms-2 mb-2" style={{ color: "red" }}>
					{error}
				</span>
			)}
		</div>
	);
};
