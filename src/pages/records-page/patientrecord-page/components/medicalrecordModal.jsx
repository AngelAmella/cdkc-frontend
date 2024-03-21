import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function MedicalRecordModal({ patientId, onClose }) {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const id = patientId;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records/get-medical-history/" + id)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching medical record data:", error);
      });
  }, [id]);

  const handleEditClick = (record) => {
    setIsEditing(true);
    setEditingRecord(record);
  };

  const handleSaveClick = () => {
    const { _id, ...updatedData } = editingRecord;
    axios
      .put(`http://localhost:5000/api/records/medical-history/${_id}`, updatedData)
      .then((result) => {
        setData((prevData) => {
          const updatedData = prevData.map((record) =>
            record._id === _id ? { ...record, ...editingRecord } : record
          );
          return updatedData;
        });
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the field is "allergies" and if the value contains only letters
    if (name === "allergies") {
      // Check if the length of the value exceeds 50 characters
      if (value.length > 50) {
        // Display an alert message
        alert("Allergies should not exceed 50 characters.");
        // Exit the function without updating the state
        return;
      }
  
      // Check if the value contains only letters and comma
      if (!/^[a-zA-Z,\s]*$/.test(value)) {
        // Display an alert message
        alert("Invalid input for Allergies."); //Please enter only letters in the allergies field.
        // Exit the function without updating the state
        return;
      }
    }

    // Validation for "Diagnosis" field
    if (name === "diagnosis") {
      if (value.length > 50) {
        alert("Diagnosis should exceed 50 characters.");
        return;
      }

      if (!/^[a-zA-Z,\s]*$/.test(value)) {
        alert("Invalid input for Diagnosis."); //Please enter only letters in the diagnosis field.
        return;
      }
    }

    // Validation for "Blood Pressure" field
    if (name === "bloodPressure") {
      // Allow only numbers and the character '/'
      if (!/^[0-9/]*$/.test(value)) {
        alert("Invalid input for Blood Pressure."); //Please enter only numbers and the character '/' in the blood pressure field.
        return;
      }

      // Check if the length of the value exceeds 7 characters
      if (value.length > 7) {
        // Display an alert message
        alert("Blood Pressure should not exceed 7 characters.");
        // Exit the function without updating the state
        return;
      }
    }

    // Validation for "Temperature" field
    if (name === "temperature") {
      // Allow only numbers, the character '.', 'C', and 'F'
      if (!/^[0-9.CcFf]*$/.test(value)) {
        alert("Invalid input for Temperature."); //Please enter only numbers, '.', 'C', or 'F' in the temperature field.
        return;
      }

      // Check if the length of the value exceeds 5 characters
      if (value.length > 5) {
        // Display an alert message
        alert("Temperature should exceed 5 characters.");
        // Exit the function without updating the state
        return;
      }
    }

    // Validation for "Surgeries" field
    if (name === "surgeries") {
      // Allow only letters and commas
      if (!/^[a-zA-Z,\s]*$/.test(value)) {
        alert("Invalid input for Symptoms."); //Please enter only letters and commas in the surgeries field.
        return;
      }

      // Check if the length of the value exceeds 100 characters
      if (value.length > 500) {
        alert("Surgeries should not exceed 500 characters.");
        return;
      }
    }
    
  
    setEditingRecord((prevEditingRecord) => ({
      ...prevEditingRecord,
      [name]: value,
    }));
  };

  return (
    <div className="medicalrecord-table-content">
      <div className="medical-table-container">
        <table className="modal-table">
          <thead id="header-medicalrecord">
            <tr>
              <th>Allergies</th>
              <th>Diagnosis</th>
              <th>Blood Pressure</th>
              <th>Temperature</th>
              <th>Symptoms</th> {/*replace of surgery */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((history) => (
              <tr key={history._id}>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="allergies"
                      className="modal-change"
                      value={editingRecord.allergies}
                      onChange={handleInputChange}
                    />
                  ) : (
                    history.allergies
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="diagnosis"
                      className="modal-change"
                      value={editingRecord.diagnosis}
                      onChange={handleInputChange}
                    />
                  ) : (
                    history.diagnosis
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="bloodPressure"
                      className="modal-change"
                      value={editingRecord.bloodPressure}
                      onChange={handleInputChange}
                    />
                  ) : (
                    history.bloodPressure
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="temperature"
                      className="modal-change"
                      value={editingRecord.temperature}
                      onChange={handleInputChange}
                    />
                  ) : (
                    history.temperature
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="surgeries"
                      className="modal-change"
                      value={editingRecord.surgeries}
                      onChange={handleInputChange}
                    />
                  ) : (
                    history.surgeries
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <button className="savebtn-modal" onClick={handleSaveClick}>
                        Save
                      </button>
                      <button className="cancelbtn-modal" onClick={handleCancelClick}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="editbtn-modal" onClick={() => handleEditClick(history)}>
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}