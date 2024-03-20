import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie'

export default function HistoryTablePtn() {
  const [data, setData] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const { medicalId } = useParams();
  const [userId, setUserId] = useState(null);
  const [UserName, setUserName] = useState("");

  const filteredName = data.filter((record) => {
    return record.patientName === UserName;
  });

  console.log('filteredName', filteredName)
  useEffect(() => {
    const storedUserId = Cookies.get("userId");
    setUserId(storedUserId);

    if (storedUserId) {
      axios
        .get(`http://localhost:5000/api/user/${storedUserId}`)
        .then((response) => {
          console.log('User Details', response.data);
          setUserName(response.data.UserName)
        })
        .catch((error) => console.error(error));
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/records")
      .then((response) => {
        setData(response.data);
        console.log('Fetched Medical Records:', response.data);
      })
      .catch((error) => {
        console.error("Error fetching patient record data:", error);
      });
  }, []);

  const handleViewDetails = (medicalId) => {
    setSelectedPatientId(medicalId);
  };

  const handleCloseDetails = () => {
    setSelectedPatientId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); 
  };

  return (
    <>
      <div className="table-history-content">
        <div className="table-history-container">
          <table className="table-ptn">
            <thead id="header-patientrecord">
              <tr>
                <th>Patient Name</th>
                <th>Weight</th>
                <th>Height</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Created At</th>
                <th>More Details</th>
              </tr>
            </thead>
            <tbody id="tbodyptn">
              {filteredName.map((record) => (
                <tr key={record._id}>
                  <td>{record.patientName}</td>
                  <td>{record.weight}</td>
                  <td>{record.height}</td>
                  <td>{record.age}</td>
                  <td>{record.sex}</td>
                  <td>{formatDate(record.createdAt)}</td> {/* Format the date here */}
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
      {selectedPatientId && (
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
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody id="medhisto-array">
                {data
                  .filter((history) => history._id === selectedPatientId)
                  .map((history) => (
                    history.medicalHistory.map((medicalRecord, index) => (
                      <tr key={index}>
                        <td>{medicalRecord.allergies}</td>
                        <td>{medicalRecord.diagnosis}</td>
                        <td>{medicalRecord.bloodPressure}</td>
                        <td>{medicalRecord.temperature}</td>
                        <td>{medicalRecord.surgeries}</td>
                        <td>{formatDate(history.createdAt)}</td> {/* Format the date here */}
                      </tr>
                    ))
                  ))}
              </tbody>
            </table>
            <button
              className="close-details"
              onClick={handleCloseDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
