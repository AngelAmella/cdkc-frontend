import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function MedicalRecordModal({ patientId, onClose }) {
  const [data, setData] = useState([]);
  const [editingRecords, setEditingRecords] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState({});

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

  const handleEditClick = (recordId) => {
    setIsEditing(true);
    setEditingRecords((prev) => ({ ...prev, [recordId]: true }));
  };

  const handleSaveClick = (recordId) => {
    const editingRecordIndex = data.findIndex((record) => record._id === recordId);
    const editedRecord = { ...data[editingRecordIndex], ...unsavedChanges[recordId] };
    
    const confirmation = window.confirm("Are you sure you want to save your changes?");
    if (confirmation) {
      axios
        .put(`http://localhost:5000/api/records/medical-history/${recordId}`, editedRecord)
        .then((result) => {
          const newData = [...data];
          newData[editingRecordIndex] = editedRecord;
          setData(newData);
          setIsEditing(false);
          setEditingRecords((prev) => ({ ...prev, [recordId]: false }));
          setUnsavedChanges((prev) => ({ ...prev, [recordId]: undefined }));
          alert("Changes saved successfully.");
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  
  

  const handleCancelClick = (recordId) => {
    // Reset the editing state
    setIsEditing(false);
    setEditingRecords((prev) => ({ ...prev, [recordId]: false }));
    // Discard unsaved changes
    setUnsavedChanges((prev) => ({ ...prev, [recordId]: undefined }));
  };

  const handleInputChange = (e, recordId) => {
    const { name, value } = e.target;
    setUnsavedChanges((prev) => ({
      ...prev,
      [recordId]: { ...prev[recordId], [name]: value }
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
              <th>Surgeries</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((history) => (
              <tr key={history._id}>
                <td>
                  {editingRecords[history._id] ? (
                    <input
                      type="text"
                      name="allergies"
                      className="modal-change"
                      value={unsavedChanges[history._id]?.allergies || history.allergies}
                      onChange={(e) => handleInputChange(e, history._id)}
                    />
                  ) : (
                    history.allergies
                  )}
                </td>
                <td>
                  {editingRecords[history._id] ? (
                    <input
                      type="text"
                      name="diagnosis"
                      className="modal-change"
                      value={unsavedChanges[history._id]?.diagnosis || history.diagnosis}
                      onChange={(e) => handleInputChange(e, history._id)}
                    />
                  ) : (
                    history.diagnosis
                  )}
                </td>
                <td>
                  {editingRecords[history._id] ? (
                    <input
                      type="text"
                      name="bloodPressure"
                      className="modal-change"
                      value={unsavedChanges[history._id]?.bloodPressure || history.bloodPressure}
                      onChange={(e) => handleInputChange(e, history._id)}
                    />
                  ) : (
                    history.bloodPressure
                  )}
                </td>
                <td>
                  {editingRecords[history._id] ? (
                    <input
                      type="text"
                      name="temperature"
                      className="modal-change"
                      value={unsavedChanges[history._id]?.temperature || history.temperature}
                      onChange={(e) => handleInputChange(e, history._id)}
                    />
                  ) : (
                    history.temperature
                  )}
                </td>
                <td>
                  {editingRecords[history._id] ? (
                    <input
                      type="text"
                      name="surgeries"
                      className="modal-change"
                      value={unsavedChanges[history._id]?.surgeries || history.surgeries}
                      onChange={(e) => handleInputChange(e, history._id)}
                    />
                  ) : (
                    history.surgeries
                  )}
                </td>
                <td>
                  {editingRecords[history._id] ? (
                    <>
                      <button
                        className="savebtn-modal"
                        onClick={() => handleSaveClick(history._id)}
                      >
                        Save
                      </button>
                      <button
                        className="cancelbtn-modal"
                        onClick={() => handleCancelClick(history._id)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="editbtn-modal"
                      onClick={() => handleEditClick(history._id)}
                    >
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
