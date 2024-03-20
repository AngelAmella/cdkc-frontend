import React, { useState , useEffect} from 'react';
import axios from 'axios';
import '../patientrecord.css';
// import Button from './button';
import { useFormik } from 'formik';
import { recordSchema } from '../../../../components/schema/schemaindex';

export default function PatientRecordForm() {
  // const [patientName, setPatientName] = useState('');
  // const [weight, setWeight] = useState('');
  // const [height, setHeight] = useState('');
  // const [age, setAge] = useState('');
  // const [sex, setSex] = useState('');
  // const [selectedUser, setSelectedUser] = useState('');

  // const [PatientRecord, setPatientRecord] = useState([
  //   { PatientRecord: '' },
  // ]);

  // const handlePatientRecordAdd = () => {
  //   setPatientRecord([...PatientRecord, { PatientRecord: '' }]);
  // };
  //   const onSubmit = (e) => {
  //     e.preventDefault();
  
  //     axios
  //       .post('http://localhost:5000/api/records', {
  //         patientName,
  //         weight,
  //         height,
  //         age,
  //         sex,
  //       })
  //       .then((result) => {
  //         console.log(result);
  
  //         // Clear the form fields after successful submission
  //         setPatientName('');
  //         setWeight('');
  //         setHeight('');
  //         setAge('');
  //         setSex('');
  //       })
  //       .catch((err) => console.log(err));
  //   };

  const [users, setUsers] = useState([]);

  useEffect (() => {
    axios.get('http://localhost:5000/api/user/')
    .then(response => {
      setUsers(response.data);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
}, []); 
  
const validationSchema = recordSchema(users);
const {values, errors, touched, handleBlur, handleChange, setFieldValue, handleSubmit} = useFormik ({
  initialValues:{
    patientName:'',
    weight:'',
    height:'',
    age:'',
    sex:''
  },
  validationSchema,
  onSubmit: async (values) => {
    try{
      await axios.post('http://localhost:5000/api/records', values);
      alert('Record successfully added.');

        setFieldValue('patientName', '');
        setFieldValue('weight', '');
        setFieldValue('height', '');
        setFieldValue('age', '');
        setFieldValue('sex', '');
    }catch (error){
        console.error('Error submitting record:', error);
    }
  }
})

const handleUserChange = (e) =>{
  setFieldValue("patientName",e.target.value)
}
const handleSexChange = (e) =>{
  setFieldValue("sex",e.target.value)
}

  return ( 
    <>
      <form className="create-patientrecord"  autoComplete='off' onSubmit={handleSubmit}>
      <div className="validations-record">
      <label htmlFor='select-user-record'></label>
        <select
        id='select-user-record'
        value={values.patientName}
        onChange={handleUserChange}
        onBlur={handleBlur}
        className={errors.patientName && touched.patientName ? "rec-input-error" : "input-patientrecord"}
        >
          <option value=''>Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user.UserName}>
              {user.UserName}
            </option>
          ))}
        </select>
        <p className='rec-errors-p'>{errors.patientName}</p>
        </div>

        <div className="validations-record">
        <label htmlFor='weight'></label>
        <input
          id='weight'
          type="text"
          value={values.weight}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" Weight"
          className={errors.weight && touched.weight ? "rec-input-error" : "input-patientrecord"}
        />
        <p className='rec-errors-p'>{errors.weight}</p>
        </div>

        <div className="validations-record">
        <label htmlFor='height'></label>
        <input
          id='height'
          type="text"
          value={values.height}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" Height"
          className={errors.height && touched.height ? "rec-input-error" : "input-patientrecord"}
        />
        <p className='rec-errors-p'>{errors.height}</p>
        </div>

        <div className="validations-record">
        <label htmlFor='age'></label>
        <input
          id='age'
          type="text"
          value={values.age}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" Age"
          className={errors.age && touched.age ? "rec-input-error" : "input-patientrecord"}
        />
        <p className='rec-errors-p'>{errors.age}</p>
        </div>

        <div className="validations-record">
        <label htmlFor='select-sex-record'></label>
        <select
          id='select-sex-record'
          placeholder=" Sex"
          value={values.sex}
          onChange={handleSexChange}
          onBlur={handleBlur}
          className={errors.sex && touched.sex ? "rec-input-error" : "input-patientrecord"}
        >
          <option value="" disabled>Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <p className='rec-errors-p'>{errors.sex}</p>
        </div>

        <button type='submit' id='add-record-btn'>Add</button>
      </form>
    </>
  );
}
