import React, { useState, useEffect } from "react";
import axios from "axios";
import ReportsView from "./reportsview";
import { useFormik } from 'formik';
import { reportSchema } from "../../../components/schema/schemaindex";

export default function ReportsForm() {
  
  const [fetchedData, setFetchedData] = useState(null);
  const [showTable, setShowTable] = useState(false); // State to control table visibility

  const {values, errors, touched, handleBlur, setFieldValue, handleSubmit} = useFormik({
    initialValues:{
      selectedType: "",
      firstParams: ""
    },
    validationSchema: reportSchema,
    onSubmit: async (values) => {
      try {
        let apiUrl = "";
        let params = {
          text: {
            query: values.firstParams,
            path: {
              wildcard: '*',
            },
          },
        };

        // Check if firstParams is a valid number and add it to params if present
        const numericValue = parseFloat(values.firstParams);
        if (!isNaN(numericValue)) {
          params.text.numericQuery = numericValue;
        }

        // Determine the API endpoint based on the selectedType
        switch (values.selectedType) {
          case "Appointments":
            apiUrl = "http://localhost:5000/api/appointments/search";
            break;
          case "Records":
            apiUrl = "http://localhost:5000/api/records/search";
            break;
          case "Inventory":
            apiUrl = "http://localhost:5000/api/inventory/search";
            break;
          case "Users":
            apiUrl = "http://localhost:5000/api/user/search";
            break;
          case "Orders":
            apiUrl = "http://localhost:5000/api/purchase/search";
            break;
          default:
            console.error("Invalid type selected");
            return;
        }

        // Fetch data from the API
        const response = await axios.post(apiUrl, params);
        const responseData = response.data;
        setFetchedData(responseData); 
        setShowTable(true);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  });

  const handleTypeChange = (e) => {
    setFieldValue("selectedType", e.target.value);
    setShowTable(false);
  }
  const handleParamsChange = (e) => {
    const { value } = e.target;
    setFieldValue("firstParams", value);
    if (!value.trim()) {
      setShowTable(false); // Hide the table when the query input is empty
    }
  }

  return (
    <>
      {/* Form for selecting report type and entering query parameters */}
      <form onSubmit={handleSubmit} className="reports-form-container" autoComplete="off" id="form-reports">
        <div className="selectedType-div">
          <label htmlFor="reports-select"></label>
          <select
            id="reports-select"
            value={values.selectedType}
            onChange={handleTypeChange}
            onBlur={handleBlur}
          >
            <option value="" disabled>
              Service Params
            </option>
            <option value="Appointments">Appointments</option>
            <option value="Records">Records</option>
            <option value="Inventory">Inventory</option>
            <option value="Users">Users</option>
            <option value="Orders">Orders</option>
          </select>
        </div>

        <div className="firstParams-div">
          <label htmlFor="firstParams"></label>
          <input
            id="firstParams"
            type="text"
            value={values.firstParams}
            onChange={handleParamsChange}
            onBlur={handleBlur}
            placeholder="Query"
          />
        </div>

        <button type="submit" id="reports-form-btn">Generate</button>
      </form>

      {showTable && fetchedData && (
        <ReportsView
          tableData={fetchedData}
          selectedType={values.selectedType}
          searchedQuery={values.firstParams}
          generateButtonClicked={true} 
        />
      )}
    </>
  );
}
