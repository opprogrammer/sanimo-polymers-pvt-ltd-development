import { stateOptions } from "constants/master";
import { Field } from "redux-form";

import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { onWheelHandler } from "utils/onWheelHandler";

export const renderPartyDelivery = ({
	fields,
	meta,
	isFetchingDropdown,
	errors,
	isViewOnly,
}) => {
	const columnsList = [
		"Delivery Address Line 1",
		"Delivery Address Line 2",
		"City",
		"State",
		"Pincode",
	];

	return (
		<>
			<hr />
			<div className="d-flex flex-column" style={{ overflowX: "auto" }}>
				<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-3">
					<h4 className="text-start">Party Delivery</h4>
					{!isViewOnly && (
						<button
							className="me-2 btn btn-primary"
							type="button"
							onClick={() => fields.unshift({ id: null })}
						>
							Add Delivery
						</button>
					)}
				</div>
				{fields?.length === 0 ? (
					<h6 className="m-3 align-self-center">
						No party delivery added. Click on Add Delivery button to add one.
					</h6>
				) : (
					fields?.length && (
						<div className="text-nowrap">
							{columnsList.map(label => (
								<label key={label} className="subform-table-item fw-500">
									{label}
								</label>
							))}
						</div>
					)
				)}
				{fields.map((delivery, index) => {
					return (
						<div key={index} className="text-nowrap">
							<div className="mb-1 subform-table-item">
								<Field
									name={`${delivery}.address_1`}
									component={ReduxFormTextField}
									className="mt-1"
									maxLength={100}
									placeholder="Delivery Address Line 1"
									disabled={isViewOnly}
								/>
							</div>
							<div className="mb-1 subform-table-item">
								<Field
									name={`${delivery}.address_2`}
									component={ReduxFormTextField}
									className="mt-1"
									maxLength={100}
									placeholder="Delivery Address Line 2"
									disabled={isViewOnly}
								/>
							</div>
							<div className="mb-1 subform-table-item">
								<Field
									name={`${delivery}.city`}
									component={ReduxFormTextField}
									className="mt-1"
									maxLength={50}
									placeholder="Enter City"
									disabled={isViewOnly}
								/>
							</div>
							<div className="mb-1 subform-table-item">
								<Field
									component={ReduxFormSelectField}
									name={`${delivery}.state`}
									className="mt-1"
									disabled={isFetchingDropdown || isViewOnly}
									options={stateOptions}
									touched={meta?.delivery?.[index]?.state?.touched}
									error={errors?.delivery?.[index]?.state}
									menuPosition="fixed"
									isSubForm={true}
								/>
							</div>
							<div className="mb-1 subform-table-item">
								<Field
									name={`${delivery}.pincode`}
									component={ReduxFormTextField}
									className="mt-1"
									type="number"
									onWheel={e => onWheelHandler(e)}
									placeholder="Enter Pincode"
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
	);
};
