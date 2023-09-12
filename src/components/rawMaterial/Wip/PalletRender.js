import apiConfig from "actions/apiConfig";
import axios from "axios";
import { useSelector } from "react-redux";
import stringifyQueryParams from "../../../utils/stringifyQueryParams";
import { getUserDetails } from "reducers/user";
import { useEffect, useState } from "react";
import { Field } from "redux-form";
import { ReduxFormTextField } from "utils/ReduxFormTextField";
import { Col, Row } from "react-bootstrap";
import WipWrapper from "./WipWrapper";
import {

	FieldArray,
	change,
	formValueSelector,
	getFormMeta,
	getFormSyncErrors,
	reduxForm,
} from "redux-form";
import { useDispatch } from "react-redux";

export const Pallet_render = (props) => {
  const columnsList = [
    "Pallet_no",
    "Number of Cheese",
    "Number of Cartons",
    "Net Weight",
    "Average Weight",
    "Location",
  ];

  const dispatch=useDispatch()

  const formName = "wipForm";
const formSelector = formValueSelector(formName);

  const wipPallet = useSelector(state => formSelector(state, "wip_pallet"));

  //const [isChecked, setIsChecked] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const [cheese,setCheese]=useState(0);
  const [cartons,setCartons]=useState(0);
  let totalCheese=0;
  let totalCartons=0;
  

  const handleCheckboxChange = (e) => {
    const { id,value, checked,name } = e.target;
    // const checkboxId = e.target.id;
    // const isChecked = e.target.checked;

    let values=[]

    if (checked) {
      //console.log("Wip Pallet: " + props.wipPallet.length)
      //props.meta
      //setCheckedIds((prevIds) => [...prevIds, id])
      values=([...checkedIds, id]);
      totalCheese=cheese +parseInt(value);
      totalCartons=cartons +parseInt(name);
      
    } else {
      //setCheckedIds((prevIds) => prevIds.filter((id) => id !== id));
      values=(checkedIds.filter((item) => item !== id));
      totalCheese =cheese-parseInt(value);
      totalCartons=cartons - parseInt(name);
      
    }
    
    setCheckedIds(values)
    setCheese(totalCheese)
    setCartons(totalCartons)

    
    dispatch(change(formName, "wip_pallet", values));
    dispatch(change(formName, "total_cheese", totalCheese));
		dispatch(change(formName, "total_cartons", totalCartons));
    // setIsChecked(!isChecked);
    // if (isChecked) {
    //   setCheckedIds((prevIds) => [...prevIds, checkboxId]);
    // } else {
    //   setCheckedIds((prevIds) => prevIds.filter((id) => id !== checkboxId));
    // }
  };
  // console.log(checkedIds);
 

  const [data, setData] = useState([]);

  const { userId } = useSelector(getUserDetails);

  const config = {
    headers: apiConfig?.getHeaders(),
  };

  //     const query={
  //         list_type: (entryType ==="repacked_pallet")?"repacked_pallet":"qc_pallet",
  //         yarn_quality_id: yarnQuality?.value,
  //         lot_id: lotNumber?.value,
  //         shade_no: shadeNumber,
  //         grade: grade,
  //     }
  // const queryString = stringifyQueryParams({
  //     ...query,
  //     dropdown: 1,
  //     status: 1,
  //     sort: "id",
  // });

  const query = {
    list_type:
      props.entryType === "repacked_pallet" ? "repacked_pallet" : "qc_pallet",
    yarn_quality_id: props.yarnQuality?.value,
    lot_id: props.lotNumber?.value,
    shade_no: props.shadeNumber,
    grade: props.grade,
  };
  const queryString = stringifyQueryParams({
    ...query,
    dropdown: 1,
    status: 1,
    sort: "id",
  });

  useEffect(() => {
    axios
      .get(
        `${apiConfig?.baseURL}/v1/user/${userId}/stocktest/list?${queryString}`,
        config
      )
      .then((res) => {
        setData(res.data.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  //console.log(data);

  return (
    <div className="fs-2 fw-bold mt-5">
      {/* Display data in a list */}
      {/* <ul>
                    {data.map((item) => (
                      <li className="fs-2 fw-bold" key={item.id}>{item.pallet_no}</li>
                    ))}
                  </ul> */}
      {data?.length === 0 ? (
        <>
          <h6 className="m-3 align-self-center">
            No QC entry added. Click on Add QC Pallet button to add one.
          </h6>
        </>
      ) : null}
      <>
					<div
						className="h-100"
						style={{ overflowY: "auto", maxHeight: "70vh"}}
					>
      {data?.length && (
        <div className="text-nowrap" >
          {columnsList.map((label) => (
            <label key={label} className="subform-table-item4 text-center fw-500 mb-2">
              {label}
            </label>
          ))}
        </div>
      )}

      
        {data.map((item) => (
          <>
          <Row>
            <div className="text-nowrap">
            <input
              type="checkbox"
              id={item?.id.toString()}
              checked={checkedIds.includes(item.id.toString())}
              //checked={checkedIds.includes([item?.id.toString(),item?.pallet_no,item?.no_of_cheese.toString(),item?.no_of_cartons.toString(),item?.average_weight.toString(),item?.net_weight.toString(),item?.location.name])}
              onChange={handleCheckboxChange}
              value={item?.no_of_cheese}
              key={item?.id}
              name={item?.no_of_cartons}
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
         
        ))}
        <br />
      
      {/* {data.map((item) => (
   <label>
         <Field
            //  name={`${item}.id`}
            // // id="employed"
            // key={`${item}.id`}
            // component="input"
            // type="checkbox"
            // checked={isChecked.includes(item.label)}
            // onChange={handleCheckboxChange}
            // value={`${item}.label`}

            // component={ReduxFormTextField}
						// 	// label={`${item}.label`}
						// 	// name={`${item}.id`}
						// 	type="checkbox"
          />
          {' '}
          {item.label}
        </label>
))} */}
{/* <WipWrapper checkedIds={checkedIds} /> */}
</div>
</>
    </div>
  );
};
