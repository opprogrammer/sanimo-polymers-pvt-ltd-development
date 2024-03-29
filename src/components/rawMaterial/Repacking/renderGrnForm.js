import { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import { Field, FieldArray } from "redux-form";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormAsyncSelectShade } from "utils/shadeField";
import { renderShadeList } from "./renderShadeList";

export const renderGrnForm = ({
	fields,
	metaData,
	isFetchingDropdown,
	errorsData,
	isViewOnly,
	repackedGrn,
	yarnQuality,
	lotNumber,
	shadeNumber,
	grade,
	fetchShadeList,
	isEditing,
	meta: { submitFailed, error },
}) => {
	return (
		<div className="d-flex flex-column">
			<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-2">
				<h4 className="text-start">GRN</h4>
				{(!isEditing && !isViewOnly) && (
					<button
						className="mt-2 btn btn-primary"
						type="button"
						onClick={() => fields.unshift({})}
						disabled={!yarnQuality || !lotNumber || !shadeNumber || !grade}
					>
						Add GRN Entry
					</button>
				)}
			</div>
			{fields?.length === 0 && (
				<>
					<h6 className="m-2 text-center">
						No shade entry added. Click on Add GRN Entry button to add one.
					</h6>
				</>
			)}

			<>
					<div
						className="h-100"
						style={{ overflowY: "auto", maxHeight: "30vh"}}
					>
			{fields.map((repacked_grn, index) => {
				return (
					<Fragment key={index}>
						<div className="d-flex  align-items-center w-100">
							<div className="align-self-start w-100">
								<Row>
									{(!isEditing && !isViewOnly)  && (
										<Col className="mb-1">
											<Field
												component={ReduxFormAsyncSelectShade}
												label="GRN"
												name={`${repacked_grn}.grn_no`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.repacked_grn?.[index]?.grn_no?.touched
												}
												error={errorsData?.repacked_grn?.[index]?.grn_no}
												placeholder="Select GRN"
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
									{(isEditing || isViewOnly) && (
										<Col >
											<div className="subform-table-item">
												<label className="form-label">GRN</label>
												<input
													className="form-control"
													value={repackedGrn?.[index]?.grn_no}
													disabled
												/>
											</div>
										</Col>
									)}
									{/* {(!isEditing && !isViewOnly)  && (
										<Col className="align-self-center mt-2">
											<button
												className="me-2 btn btn-danger"
												type="button"
												onClick={() => fields.remove(index)}
												
											>
												Remove
											</button>
										</Col>
									)} */}
									<Col>
									<FieldArray
									name={`${repacked_grn}.shade_entry`}
									component={renderShadeList}
									shadeList={repackedGrn?.[index]?.shade_entry}
								/>
								</Col>
								<Col></Col>
								<Col></Col>
								{(!isEditing && !isViewOnly)  && (
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
								{/* <FieldArray
									name={`${repacked_grn}.shade_entry`}
									component={renderShadeList}
									shadeList={repackedGrn?.[index]?.shade_entry}
								/> */}
							</div>
						</div>
						<hr className="w-100 my-1" />
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
		</div>
	);
};
