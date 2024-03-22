import React, { useState } from 'react';
import axios from 'axios';
import Button from '../../patientrecord-page/components/button';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import { histoSchema } from '../../../../components/schema/schemaindex';
import Head2 from '../../../../components/headers/header';

export default function MedicalRecordForm() {
  // const [allergies, setAllergies] = useState('');
  // const [diagnosis, setDiagnosis] = useState('');
  // const [bloodPressure, setBloodPressure] = useState('');
  // const [temperature, setTemperature] = useState('');
  // const [surgeries, setSurgeries] = useState('');
  // const [patientObjectId, setPatientObjectId] = useState(''); 
  // const [MedicalRecord, setMedicalRecord] = useState([
  //   { MedicalRecord: '' },
  // ]);

  // const handleMedicalRecordAdd = () => {
  //   setMedicalRecord([...MedicalRecord, { MedicalRecord: '' }]);
  // };

  // const { id } = useParams();

  // const onSubmit = (e) => {
  //   e.preventDefault();

  //   axios
  //     .post(`http://localhost:5000/api/records/${patientObjectId}/medical-history`, {
  //       allergies,
  //       diagnosis,
  //       bloodPressure,
  //       temperature,
  //       surgeries,
  //     })
  //     .then((result) => {
  //       console.log(result);

  //       // Clear the form fields after successful submission
  //       setAllergies('');
  //       setDiagnosis('');
  //       setBloodPressure('');
  //       setTemperature('');
  //       setSurgeries('');
  //       setPatientObjectId('');
  //     })
  //     .catch((err) => console.log(err));
  // };

  const {values, errors, touched, handleChange, handleBlur, handleSubmit} = useFormik({
    initialValues:{
      patientObjectId:'',
      bloodPressure:'',
      temperature:'',
      allergies:'',
      diagnosis:'',
      surgeries:''
    },
    validationSchema: histoSchema,
      onSubmit: async (values, { setSubmitting }) => {
        try {
          const response = await axios.post(`http://localhost:5000/api/records/${values.patientObjectId}/medical-history`, values);
          console.log(response.data); // Assuming your server returns some data upon successful save
          setSubmitting(false);
        } catch (error) {
          console.error('Error while submitting:', error);
          setSubmitting(false);
        }
      }
    });
  return (
    <>
      <form className="create-medicalrecord" autoComplete='off' onSubmit={handleSubmit}>
       <Head2 text="Add Medical Record" id="medicalrecordheader"/> 
        <div className="medical-validation-input">
        <label htmlFor='patientObjectId'></label>
        <input
          id='patientObjectId'
          type="text"
          value={values.patientObjectId}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" Patient ObjectId"
          className={errors.patientObjectId && touched.patientObjectId ? "histo-error-input" : "input-medicalrecord"}
        />
        <p className='med-errors-p'>{errors.patientObjectId}</p>
        </div>

        <div className="medicalinput-row">
        <div className="medical-validation-input">
        <label htmlFor='bloodPressure'></label>
          <input
          id='bloodPressure'
            type="text"
            value={values.bloodPressure}
            onChange={handleChange}
            placeholder=" Blood-Pressure"
            className={errors.bloodPressure && touched.bloodPressure ? "histo-error-input" : "input-medicalrecord custom-medical"}
          />
          <p className='med-errors-p'>{errors.bloodPressure}</p>
          </div>

          <div className="medical-validation-input">
          <label htmlFor='temperature'></label>
          <input
            id='temperature'
            type="text"
            value={values.temperature}
            onChange={handleChange}
            placeholder=" Temperature"
            className={errors.temperature && touched.temperature ? "histo-error-input" : "input-medicalrecord custom-medical-temp"}
          />
          <p className='med-errors-p'>{errors.temperature}</p>
          </div>
        </div>

        <div className="medical-validation-input">
        <label htmlFor='allergies'></label>
        <input
          id='allergies'
          type="text"
          value={values.allergies}
          onChange={handleChange}
          placeholder=" Allergies"
          className={errors.allergies && touched.allergies ? "histo-error-input" : "input-medicalrecord"}
        />
        <p className='med-errors-p'>{errors.allergies}</p>
        </div>

        <div className="medical-validation-input">
        <label htmlFor='surgeries'></label>
        <input
          id='surgeries'
          type="text"
          value={values.surgeries}
          onChange={handleChange}
          placeholder=" Symptoms"
          className={errors.surgeries && touched.surgeries ? "histo-error-input" : "input-medicalrecord"}
        />
        <p className='med-errors-p'>{errors.surgeries}</p>
        </div>

        <div className="medical-validation-input">
        <label htmlFor='diagnosis'></label>
        <input
          id='diagnosis'
          type="text"
          value={values.diagnosis}
          onChange={handleChange}
          placeholder=" Diagnosis"
          className={errors.diagnosis && touched.diagnosis ? "histo-error-input" : "input-medicalrecord"}
        />
        <p className='med-errors-p'>{errors.diagnosis}</p>
        </div>
        <button type="submit" id="medform-btn" >Add</button>
      </form>
    </>
  );
}
