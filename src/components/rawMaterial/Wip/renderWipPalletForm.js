import { Fragment, useEffect,useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Field } from "redux-form";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { ReduxFormAsyncSelectShade, ReduxFormTextFieldShade } from "utils/shadeField";
import apiConfig from "actions/apiConfig";
import axios  from "axios";
import { useDispatch, useSelector } from "react-redux";
import stringifyQueryParams from "../../../utils/stringifyQueryParams";
import { getUserDetails } from "reducers/user";
import { Pallet_render } from "./PalletRender";
import { formName } from "./WipForm";
import { change } from "redux-form";




export const RenderWipPalletForm = ({
	fields,
	isFetchingDropdown,
	errorsData,
	metaData,
	isViewOnly,
	entryType,
	yarnQuality,
	lotNumber,
	shadeNumber,
	grade,
	wipPallet,
	isEditing,
	fetchPallet,
	items,
	meta: { submitFailed, error },
}) => {

	// console.log(yarnQuality);
	// console.log(lotNumber);
	// console.log(grade);
	// console.log(shadeNumber);
	
// 	const { userId } = useSelector(getUserDetails);
// 	const config = {
// 		headers: apiConfig?.getHeaders(),
// 	};
// 	useEffect(()=>{
// 		const query={
// 			list_type: "repacked_pallet",
// 			yarn_quality_id: yarnQuality?.value,
// 			lot_id: lotNumber?.value,
// 			shade_no: shadeNumber,
// 			grade: grade,
// 		}
// 	const queryString = stringifyQueryParams({
// 		query,
// 		dropdown: 1,
// 		status: 1,
// 		sort: "id",
// 	});
// 	axios
// 		.get(
// 			`${apiConfig?.baseURL}/v1/user/${userId}/stock/list?${queryString}`,
// 			config
// 		)
// 		.then(res => {
// 			console.log(res.data.data.results);
// 		});
// });


// const columnsList = [
//     "Pallet_no",
//     "Number of Cheese",
//     "Number of Cartons",
//     "Net Weight",
//     "Average Weight",
//     "Location",
//   ];

//   //const [isChecked, setIsChecked] = useState([]);
//   const [checkedIds, setCheckedIds] = useState([]);

//   const dispatch=useDispatch();

//   const handleCheckboxChange = (e) => {
//     const { id,value, checked } = e.target;
//     // const checkboxId = e.target.id;
//     // const isChecked = e.target.checked;

    

//     if (checked) {
//       setCheckedIds([...checkedIds, id]);
// 	  wipPallet.entry_id=checkedIds;
// 	  console.log("wip", wipPallet.entry_id)
//     } else {
//       setCheckedIds(checkedIds.filter((item) => item !== id));
//     }
//     if (checkedIds) {
//       console.log("pallet id", e.target.id);
//     }


// 	dispatch(change(formName, "wip_pallet", checkedIds));



//     //wipPallet.entry_id=checkedIds;
//     // setIsChecked(!isChecked);
//     // if (isChecked) {
//     //   setCheckedIds((prevIds) => [...prevIds, checkboxId]);
//     // } else {
//     //   setCheckedIds((prevIds) => prevIds.filter((id) => id !== checkboxId));
//     // }
//   };
//   console.log(checkedIds);
// ;

//   const [data, setData] = useState([]);

 

//   const { userId } = useSelector(getUserDetails);

//   const config = {
//     headers: apiConfig?.getHeaders(),
//   };

//       const query={
//           list_type: (entryType ==="repacked_pallet")?"repacked_pallet":"repacked_pallet",
//           yarn_quality_id: yarnQuality?.value,
//           lot_id: lotNumber?.value,
//           shade_no: shadeNumber,
//           grade: grade,
//       }
//   const queryString = stringifyQueryParams({
//       ...query,
//       dropdown: 1,
//       status: 1,
//       sort: "id",
//   });


//   useEffect(() => {
//     axios
//       .get(
//         `${apiConfig?.baseURL}/v1/user/${userId}/stocktest/list?${queryString}`,
//         config
//       )
//       .then((res) => {
//         setData(res.data.data.results);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       });
//   }, []);

//   console.log(data);

const [showChildComponent, setShowChildComponent] = useState(false);

// if(data?.length!==0){
// 	setShowChildComponent(true);
// }
const handleClick = () => {
    setShowChildComponent(true);
  };
	return (
		<div className="d-flex flex-column">
			<div className="d-flex flex-row align-items-center justify-content-around w-100 mb-2">
				<h4 className="text-start">Wip Pallet</h4>
				{(!isEditing && !isViewOnly) && (
					<button
						className="mt-2 btn btn-primary"
						type="button"
						onClick={handleClick}
						//onClick={Pallet_render(yarnQuality,lotNumber,shadeNumber,grade,entryType)}
						 //onClick={() => fields.unshift({})}
						 disabled={!yarnQuality || !lotNumber || !shadeNumber || !grade}
					>
						Add WIP Pallet
					</button>
				)}
			</div>
			{/* {fields?.length === 0 && (
				<>
					<h6 className="m-2 text-center">
						No WIP pallet added. Click on Add WIP Pallet button to add one.
					</h6>
				</>
			)} */}
			{/* {data?.length === 0 ? (
        <>
          <h6 className="m-3 align-self-center">
            No QC entry added. Click on Add QC Pallet button to add one.
          </h6>
        </>
      ) : null}
      {data?.length && (
        <div className="text-nowrap">
          {columnsList.map((label) => (
            <label key={label} className="subform-table-item4 text-center fw-500 mb-2">
              {label}
            </label>
          ))}
        </div>
      )} */}
			<>
					<div
						className="h-100"
						style={{ overflowY: "auto", maxHeight: "70vh"}}
					>
			{fields.map((wip_pallet, index) => {
				return (
					<Fragment key={index}>
						<div className="d-flex justify-content-center align-items-center w-100">
							<div className="align-self-start w-100">
								<Row>
									
									{ (entryType === "repacked_pallet") ?  !showChildComponent && (
										<Col className="mb-1">
											<Field
												component={ReduxFormAsyncSelectShade}
												label="Repacked Pallet"
												name={`${wip_pallet}.entry_id`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.wip_pallet?.[index]?.entry_id?.touched
												}
												error={errorsData?.wip_pallet?.[index]?.entry_id}
												placeholder="Select Repacked Pallet"
												masterDropdownName="stock"
												onChange={({ value }) =>
													fetchPallet(value, index, "repacked_pallet")
												}
												status={1}
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
									) : !showChildComponent && (!isEditing && !isViewOnly) &&(
										<Col className="mb-1">
											<Field
												component={ReduxFormAsyncSelectShade}
												label="QC Pallet"
												name={`${wip_pallet}.entry_id`}
												disabled={isFetchingDropdown || isViewOnly || isEditing}
												touched={
													metaData?.wip_pallet?.[index]?.entry_id?.touched
												}
												error={errorsData?.wip_pallet?.[index]?.entry_id}
												placeholder="Select QC Pallet"
												masterDropdownName="stock"
												onChange={({ value }) =>
													fetchPallet(value, index, "qc_pallet")
												}
												status={1}
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

								{/* {(!isEditing && !isViewOnly) && (
										<Col >
											<div className="subform-table-item">
												<label className="form-label">{`${wip_pallet?.[index]?.entry_id}`}</label>
												<input
													className="form-control"
													value={wip_pallet?.[index]?.pallet_no}
													disabled
												/>
											</div>
										</Col>
									)} */}
									
									
									
									<Col>
									{wipPallet?.[index]?.pallet_entry && (
									<div className="text-nowrap" style={{ overflowX: "auto" }}>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Number of Cheese</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.no_of_cheese}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Number of Cartons</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.no_of_cartons}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Net Weight</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.net_weight}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Average Weight</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.average_weight}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Location</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.location?.name}
												disabled
											/>
										</div>
									</div>
									)}
									</Col>
									{!showChildComponent &&(!isEditing && !isViewOnly) && (
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
									<Col></Col>
									<Col></Col>
									
								</Row>
								{/* {wipPallet?.[index]?.pallet_entry && (
									<div className="text-nowrap" style={{ overflowX: "auto" }}>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Number of Cheese</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.no_of_cheese}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Number of Cartons</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.no_of_cartons}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Net Weight</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.net_weight}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Average Weight</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.average_weight}
												disabled
											/>
										</div>
										<div className="mb-1 subform-table-item">
											<label className="fw-500">Location</label>
											<input
												className="form-control"
												value={wipPallet?.[index]?.pallet_entry?.location?.name}
												disabled
											/>
										</div>
									</div>
								)} */}
							</div>
						</div>
						{/* <hr className="w-100 mt-9" /> */}
					</Fragment>

				);
			})}
{/* {showChildComponent && (
{
data.map((wip_pallet, index) => {
				return (
					<Fragment key={index}>
						<div className="d-flex justify-content-center align-items-center w-100">
							<div className="align-self-start w-100">
								<Row>
									<Col>
								<input
              type="checkbox"
              id={wip_pallet?.id}
              checked={checkedIds.includes(wip_pallet?.id)}
              onChange={handleCheckboxChange}
              //key={item?.id}
              value={wip_pallet?.id}
            />
			</Col>
			<Col>
			<div className="mb-1 subform-table-item3">
            <input className="form-control" 
            value={wip_pallet?.pallet_no} 
            disabled />
            </div>
			</Col>
			<Col>
            <div className="mb-1 subform-table-item3">
            <input
              className="form-control"
              value={wip_pallet?.no_of_cheese}
              disabled
            />
            </div>
			</Col>
			<Col>
          <div className="mb-1 subform-table-item3">
            <input
              className="form-control"
              value={wip_pallet?.no_of_cartons}
              disabled
            />
            </div>
			</Col>
			<Col>
            <div className="mb-1 subform-table-item3">
            <input className="form-control" 
            value={wip_pallet?.net_weight} 
            disabled />
            </div>
			</Col>
			<Col>
            <div className="mb-1 subform-table-item3">
            <input
              className="form-control"
              value={wip_pallet?.average_weight}
              disabled
            />
            </div>
			</Col>
			<Col>
            <div className="mb-1 subform-table-item3">
            <input
              className="form-control"
              value={wip_pallet?.location?.name}
              disabled
            />
            </div>
			</Col>
								</Row>
								</div>
								</div>
								</Fragment>
				);
})
} */}

 {showChildComponent && <Field
 												component={Pallet_render}
 												yarnQuality={yarnQuality} 
 												lotNumber={lotNumber} 
 												shadeNumber={shadeNumber} 
 												grade={grade}
												wipPallet={wipPallet}
 												 entryType={entryType}	
											/>}
{/* {showChildComponent && <Pallet_render yarnQuality={yarnQuality} lotNumber={lotNumber} shadeNumber={shadeNumber} grade={grade} entryType={entryType}/>} */}

{/* { showChildComponent && (
	
		
		data.map((item) => (
			<>
			<Row>
			  <div className="text-nowrap">
			  <input
				type="checkbox"
				id={item?.id.toString()}
				checked={checkedIds.includes(item.id.toString())}
				onChange={handleCheckboxChange}			
			  />
			  <div className="mb-1 subform-table-item3">
			  <input className="form-control" 
			  value={item?.pallet_no} 
			  disabled />
			  </div>
			  <div className="mb-1 subform-table-item3">
			  <input
				className="form-control"
				value={item?.no_of_cheese}
				disabled
			  />
			  </div>
			<div className="mb-1 subform-table-item3">
			  <input
				className="form-control"
				value={item?.no_of_cartons}
				disabled
			  />
			  </div>
			  <div className="mb-1 subform-table-item3">
			  <input className="form-control" 
			  value={item?.net_weight} 
			  disabled />
			  </div>
			  <div className="mb-1 subform-table-item3">
			  <input
				className="form-control"
				value={item?.average_weight}
				disabled
			  />
			  </div>
			  <div className="mb-1 subform-table-item3">
			  <input
				className="form-control"
				value={item?.location?.name}
				disabled
			  />
			  </div>
			  </div>
			  </Row>
			</>
		   
		  ))
		  
		
	
)} */}
			
			</div>
			</>
			{submitFailed && error && (
				<span className="text-center ms-2 mb-2" style={{ color: "red" }}>
					{error}
				</span>
			)}
		</div>
	);
};
