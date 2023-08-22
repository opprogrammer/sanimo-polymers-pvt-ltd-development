import { Tooltip } from "antd";
import { Field } from "redux-form";

import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";

export const renderPartyShadeReference = ({
	fields,
	metaData,
	isFetchingDropdown,
	errorsData,
	isViewOnly,
	meta: { submitFailed, error },
}) => {
	const columnsList = ["Party Name", "Party Shade Reference"];

	return (
		<>
			<hr />
			<div className="d-flex flex-column" style={{ overflowX: "auto" }}>
				<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-2">
					<h4 className="text-start">Party Shade Reference</h4>
					{!isViewOnly && (
						<button
							className="me-2 btn btn-primary"
							type="button"
							onClick={() => fields.unshift({ id: null })}
						>
							Add Reference
						</button>
					)}
				</div>
				<div className="mx-auto">
					{fields?.length === 0 ? (
						<h6 className="m-3">
							No party quality reference added. Click on Add Reference button to
							add one.
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
					{fields.map((party_shade_reference_no, index) => {
						const partyShadeReferenceTouched =
							metaData?.party_shade_reference_no?.[index]?.party_shade_reference
								?.touched;
						const partyShadeReferenceError =
							errorsData?.party_shade_reference_no?.[index]
								?.party_shade_reference;

						return (
							<div key={index} className="text-nowrap">
								<div className="mb-1 subform-table-item">
									<Field
										component={ReduxFormAsyncSelect}
										name={`${party_shade_reference_no}.party_id`}
										className="mt-1"
										disabled={isFetchingDropdown || isViewOnly}
										touched={
											metaData?.party_shade_reference_no?.[index]?.party_id
												?.touched
										}
										error={
											errorsData?.party_shade_reference_no?.[index]?.party_id
										}
										masterDropdownName="party"
										menuPosition="fixed"
										isSubForm={true}
									/>
								</div>

								<div className="mb-1 subform-table-item">
									<Tooltip
										title={
											partyShadeReferenceTouched && partyShadeReferenceError
												? partyShadeReferenceError
												: null
										}
									>
										<Field
											component="textarea"
											name={`${party_shade_reference_no}.party_shade_reference`}
											className={`form-control mt-1 border border-${
												partyShadeReferenceTouched && partyShadeReferenceError
													? "danger"
													: "secondary"
											}`}
											maxLength={250}
											rows={3}
											disabled={isViewOnly}
										/>
									</Tooltip>
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
				{submitFailed && error && (
					<span className="text-center m-2" style={{ color: "red" }}>
						{error}
					</span>
				)}
			</div>
		</>
	);
};
