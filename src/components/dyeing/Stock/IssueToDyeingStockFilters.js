import { Col, Row } from "react-bootstrap";

import { Field, reduxForm } from "redux-form";
import { ReduxFormAsyncSelect } from "utils/ReduxFormAsyncSelect";
import { ReduxFormSelectField } from "utils/ReduxFormSelectField";
import { ReduxFormTextField } from "utils/ReduxFormTextField";

import { gradeOptions } from "components/rawMaterial/Grn/grnConstants";
import { dyeingGradationOptions } from "components/rawMaterial/QualityCheck/qualityCheckConstants";

export const formName = "dyeingStockFilters";

const IssueToDyeingStockFilters = ({ handleSubmit, handleReset }) => {
	return (
		<form onSubmit={handleSubmit}>
			<Row>
				<Col className="mb-2">
					<Field
						component={ReduxFormAsyncSelect}
						name="yarn_quality_ids"
						label="Quality Name"
						masterDropdownName="yarn-quality"
						placeholder="Quality Name"
						isMulti
					/>
				</Col>
				<Col className="mb-2">
					<Field
						component={ReduxFormTextField}
						maxLength={25}
						label="Shade Number"
						name="shade_no"
						placeholder="Filter Shade Number"
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormAsyncSelect}
						name="lot_ids"
						label="Lot Number"
						placeholder="Enter Lot Number"
						masterDropdownName="lot"
						isMulti
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormSelectField}
						name="grade"
						label="Grade"
						options={gradeOptions}
					/>
				</Col>
				<Col className="mb-1">
					<Field
						component={ReduxFormSelectField}
						name="dyeing_gradation"
						label="Dyeing Gradation"
						options={dyeingGradationOptions}
					/>
				</Col>
				<Col className="d-flex mb-1" xs={2}>
					<button
						className="btn btn-secondary align-self-center fs-7 fw-500"
						type="button"
						onClick={handleReset}
					>
						Reset
					</button>
					<button
						className="btn ms-2 me-2 align-self-center fs-7 fw-500 bg-color-orange color-white table-btn"
						type="submit"
					>
						Submit
					</button>
				</Col>
			</Row>
		</form>
	);
};

export default reduxForm({ form: formName })(IssueToDyeingStockFilters);
