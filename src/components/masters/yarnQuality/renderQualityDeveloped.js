import { Field } from "redux-form";

import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
import { ReduxFormTextField } from "utils/ReduxFormTextField";

import { onWheelHandler } from "utils/onWheelHandler";
import { uomOptions } from "./yarnQualityConstants";

export const renderQualityDeveloped = ({
	fields,
	meta,
	isFetchingDropdown,
	errors,
	isViewOnly,
}) => {
	const columnsList = ["Yarn Quality", "UOM", "Shade", "Percentage"];

	return (
		<>
			<hr />
			<div className="d-flex flex-column" style={{ overflowX: "auto" }}>
				<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-2">
					<h4 className="text-start">Quality Developed</h4>
					{!isViewOnly && (
						<button
							className="me-2 btn btn-primary"
							type="button"
							onClick={() => fields.unshift({ id: null })}
						>
							Add Quality Developed
						</button>
					)}
				</div>
				<div className="mx-auto">
					{fields?.length === 0 ? (
						<h6 className="m-3">
							No quality developed added. Click on Add Quality Developed button
							to add one.
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
					{fields.map((quality_developed, index) => {
						return (
							<div key={index} className="text-nowrap">
								<div className="subform-table-item">
									<Field
										component={ReduxFormAsyncSelect}
										name={`${quality_developed}.quality_id`}
										className="mt-1"
										disabled={isFetchingDropdown || isViewOnly}
										touched={
											meta?.quality_developed?.[index]?.quality_id?.touched
										}
										error={errors?.quality_developed?.[index]?.quality_id}
										placeholder="Quality Name"
										masterDropdownName="yarn-quality"
										menuPosition="fixed"
										isSubForm={true}
									/>
								</div>

								<div className="subform-table-item">
									<Field
										component={ReduxFormSelectField}
										name={`${quality_developed}.uom`}
										className="mt-1"
										disabled={isViewOnly}
										options={uomOptions}
										touched={meta?.quality_developed?.[index]?.uom?.touched}
										error={errors?.quality_developed?.[index]?.uom}
										menuPosition="fixed"
										isSubForm={true}
									/>
								</div>

								<div className="subform-table-item">
									<Field
										component={ReduxFormAsyncSelect}
										name={`${quality_developed}.shade_id`}
										className="mt-1"
										disabled={isFetchingDropdown || isViewOnly}
										touched={
											meta?.quality_developed?.[index]?.shade_id?.touched
										}
										error={errors?.quality_developed?.[index]?.shade_id}
										placeholder="Shade"
										masterDropdownName="shade"
										menuPosition="fixed"
										isSubForm={true}
									/>
								</div>

								<div className="subform-table-item">
									<Field
										name={`${quality_developed}.percentage`}
										component={ReduxFormTextField}
										className="mt-1"
										type="number"
										onWheel={e => onWheelHandler(e)}
										step=".01"
										placeholder="Percentage"
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
			</div>
		</>
	);
};
