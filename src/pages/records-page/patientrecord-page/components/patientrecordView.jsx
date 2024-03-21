import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicalRecordModal from "./medicalrecordModal";
import { useParams } from "react-router-dom";

export default function PatientRecordView() {
  const [data, setData] = useState([]);
  const [showMedicalHistory, setShowMedicalHistory] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [sortBy, setSortBy] = useState("latest"); // Added state for sorting

  const { medicalId } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching patient record data:", error);
      });
  }, [editingRecord]);

  const handleViewDetails = (medicalId) => {
    setSelectedPatientId(medicalId);
    setShowMedicalHistory(true);

    axios
      .get(`http://localhost:5000/api/records/get-medical-history/${medicalId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching medical record", error);
      });
  };

  const filteredData = data.filter((record) =>
    //record.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    record.patientName.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const handleEditClick = (record) => {
    setEditingRecord(record);
  };

  const handleSaveClick = () => {
    const confirmation = window.confirm("Are you sure you want to save your changes?");
    if (confirmation) {
      const { _id, ...updatedData } = editingRecord;
      axios
        .put(`http://localhost:5000/api/records/${_id}`, updatedData)
        .then((result) => {
          setData((prevData) => {
            const updatedData = prevData.map((record) =>
              record._id === _id ? editingRecord : record
            );
            return updatedData;
          });
          setEditingRecord(null);
          alert("Changes saved successfully.");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };  

  const handleCancelClick = () => {
    setEditingRecord(null);
  };

  const handleEditChange = (e, record) => {
    const { name, value } = e.target;
  
    // Check if the length of the value exceeds 20 characters
    // if (value.length > 20) {
    //   alert('Input should not exceed 20 characters.');
    //   return;
    // }

    // Regular expression to match only letters and numbers
    const validNameRegex = /^[a-zA-Z0-9\s]*$/;
  
    // Regular expression to match numbers and specified characters for height
    const validHeightRegex = /^[\d'" ]*$/;
  
    // Regular expression to match numbers and specified characters for weight
    const validWeightRegex = /^[\dkglbs]*$/i;
  
    // Regular expression to match only numbers for age
    const validAgeRegex = /^\d*$/;
  
    // Regular expression to match only specified letters for sex
    const validSexRegex = /^[female]*$/i;

    // Check if the entered value matches the valid name pattern
    if (name === 'patientName') {
      if (!validNameRegex.test(value)) {
        // Display an error message or handle invalid input for patient name
        alert('Invalid input for Patient Name.'); // Only letters and numbers are allowed.
        return;
      }
      if (value.length > 20) {
        // Display an error message or handle invalid input for patient name length
        alert('Patient Name should not exceed 20 characters.');
        return;
      }
    }

    // Check if the entered value matches the valid weight pattern
    if (name === 'weight') {
      if (!validWeightRegex.test(value)) {
        // Display an error message or handle invalid input for weight
        alert('Invalid input for weight. Only (e.g., 70kg, 150lbs) are allowed.'); //Only numbers and specified characters (e.g., 70kg, 150lbs) are allowed.
        return;
      }
      if (value.length > 6) {
        // Display an error message or handle invalid input for weight length
        alert('Weight should not exceed 6 characters.');
        return;
      }
    }

    // Check if the entered value matches the valid height pattern
    if (name === 'height') {
      if (!validHeightRegex.test(value)) {
        // Display an error message or handle invalid input for height
        alert('Invalid input for height. Only (e.g., 5\'8", 6\'2") are allowed.'); //Only numbers and specified characters (e.g., 5\'8", 6\'2") are allowed.
        return;
      }
      if (value.length > 5) {
        // Display an error message or handle invalid input for height length
        alert('Height should not exceed 5 characters.');
        return;
      }
    }
  
    // Check if the entered value matches the valid age pattern
    if (name === 'age') {
      if (!validAgeRegex.test(value)) {
        // Display an error message or handle invalid input for age
        alert('Invalid input for age.'); //Only numbers are allowed.
        return;
      }
      if (value.length > 3) {
        // Display an error message or handle invalid input for age length
        alert('Age should not exceed 3 characters.');
        return;
      }
    }
  
    // Check if the entered value matches the valid sex pattern
    if (name === 'sex') {
      if (!validSexRegex.test(value)) {
        // Display an error message or handle invalid input for sex
        alert('Invalid input for sex.'); //Only "female" is allowed.
        return;
      }
      if (value.length > 6) {
        // Display an error message or handle invalid input for sex length
        alert('Sex should not exceed 6 characters.');
        return;
      }
    }
  
    // Update state with the edited value
    setEditingRecord((prevEditingRecord) => ({
      ...prevEditingRecord,
      [name]: value,
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortBy === "latest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="searchbar-record-adm">
      <div className="top-records">
      <input
        id="searchbar-record"
        type="text"
        placeholder=" Search Patient by Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      </div>
      <div className="search-sort-table"> {/*NEW CODE*/}
      <div className="sort-dropdown-order-modal-adm">
        <label htmlFor="sort">Sort By:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <div className="patientrecord-table-content">
        <div className="record-table-container">
          <table className="table-adm">
            <thead id="header-patientrecord">
              <tr>
                <th>Record ID</th>
                <th>Patient Name</th>
                <th>Weight</th>
                <th>Height</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Edit</th>
                <th>More Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record) => (
                <tr key={record._id}>
                  <td>{record._id.toString()}</td>
                  <td>
                    {editingRecord && editingRecord._id === record._id ? (
                      <input
                        type="text"
                        name="patientName"
                        className="record-change"
                        value={editingRecord.patientName}
                        onChange={(e) => handleEditChange(e, record)}
                      />
                    ) : (
                      record.patientName
                    )}
                  </td>
                  <td>
                    {editingRecord && editingRecord._id === record._id ? (
                      <input
                        type="text"
                        name="weight"
                        className="record-change"
                        value={editingRecord.weight}
                        onChange={(e) => handleEditChange(e, record)}
                      />
                    ) : (
                      record.weight
                    )}
                  </td>
                  <td>
                    {editingRecord && editingRecord._id === record._id ? (
                      <input
                        type="text"
                        name="height"
                        className="record-change"
                        value={editingRecord.height}
                        onChange={(e) => handleEditChange(e, record)}
                      />
                    ) : (
                      record.height
                    )}
                  </td>
                  <td>
                    {editingRecord && editingRecord._id === record._id ? (
                      <input
                        type="text"
                        name="age"
                        className="record-change"
                        value={editingRecord.age}
                        onChange={(e) => handleEditChange(e, record)}
                      />
                    ) : (
                      record.age
                    )}
                  </td>
                  <td>
                    {editingRecord && editingRecord._id === record._id ? (
                      <input
                        type="text"
                        name="sex"
                        className="record-change"
                        value={editingRecord.sex}
                        onChange={(e) => handleEditChange(e, record)}
                      />
                    ) : (
                      record.sex
                    )}
                  </td>
                  <td>
                    {!editingRecord || editingRecord._id !== record._id ? (
                      <button
                        className="editButton"
                        onClick={() => handleEditClick(record)}
                      >
                        Edit
                      </button>
                    ) : null}
                    {editingRecord && editingRecord._id === record._id ? (
                      <>
                        <div className="actionButtons-record">
                          <button
                            className="savebtn-record"
                            onClick={handleSaveClick}
                          >
                            Save
                          </button>
                        </div>
                        <div className="actionButtons-record">
                          <button
                            className="cancelbtn-record"
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : null}
                  </td>
                  <td>
                    <button
                      className="view-details"
                      onClick={() => handleViewDetails(record._id)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
        {showMedicalHistory && (
          <div className="overlay">
            <div className="medicalrecord-modal-container">
              <MedicalRecordModal
                patientId={selectedPatientId}
                onClose={() => setShowMedicalHistory(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
