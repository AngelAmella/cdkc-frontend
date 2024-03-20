import React, { useState } from 'react';
import './register.css'
import '../../components/headers/header.css';
import DiaLogo from '../../components/logo/logo';
import ClientLogo from '../../assets/ccmdkc-logo.png';
import Terms from '../../components/modals/terms';
import { Link } from 'react-router-dom';
import { RiEyeFill, RiEyeCloseFill } from 'react-icons/ri';
import axios from 'axios';
import {useFormik} from 'formik'
import { registerSchema } from '../../components/schema/schemaindex';



export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const [openModal, setOpenModal] = useState(false);
  
  const handleTermsLinkClick = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const {values, errors, touched, handleBlur, handleChange, setFieldValue, setFieldError, handleSubmit} = useFormik({
    initialValues:{
      FirstName: "",
      MiddleName: "",
      LastName:"",
      birthday : "",
      sex:"",
      contactNum:"",
      houseNum:"",
      street:"",
      brgy:"",
      city:"",
      prov:"",
      email:"",
      UserName:"",
      password:"",
      confirmpassword:""
    },
    validationSchema:registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/user/', values);
        console.log('Response from server:', response.data);
        const { token, userId } = response.data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('userId', userId);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        window.location.href=(`/patient/myprofile/${userId}`);
      } catch (error) {
        console.error('Error submitting registration:', error);
        if (error.response && error.response.data && error.response.data.error === 'Email already in use') {
          setFieldError('email', 'Email already exists.');
        } else if (error.response && error.response.data && error.response.data.error === 'Username already in use') {
          setFieldError('UserName', 'Username already exists.');
        }else {
          alert('An error occurred while submitting the form. Please try again.');
        }
      } finally {
        setSubmitting(false); // Set submitting state back to false
      }
    },
  });

  const handleDateChange = (e) => {
    setFieldValue("birthday", e.target.value);
  };


  console.log(errors)
  return (
    <>
      <main>
        <div className="registerpage">
          <div id="register-logo">
            <DiaLogo src={ClientLogo} />
          </div>
          <div id="register-form">
            <div className="scroll-form">
            <form onSubmit={handleSubmit} autoComplete='off' id='form-reg'>
              <div className="input-div-reg">
              <label htmlFor='FirstName'>First Name <span className="asterisk">*</span></label>
              <input
              value={values.FirstName}
              onChange={handleChange}
              onBlur={handleBlur}
              id='FirstName'
              className={errors.FirstName && touched.FirstName ? "input-error" : ""}
              type="name"
              placeholder='First Name'
              />
              </div>
              <p className='errors-p'>{errors.FirstName}</p>
             <div className="input-div-reg">
              <label htmlFor='MiddleName'>Middle Name <span className="asterisk">*</span></label>
              <input
              value={values.MiddleName}
              onChange={handleChange}
              onBlur={handleBlur}
              id='MiddleName'
              type="name"
              placeholder='Middle Name'
              className={errors.MiddleName && touched.MiddleName ? "input-error" : ""}
              />
              </div>
              <p className='errors-p'>{errors.MiddleName}</p>
              <div className="input-div-reg">
              <label htmlFor='LastName'>Last Name <span className="asterisk">*</span></label>
              <input
              value={values.LastName}
              onChange={handleChange}
              onBlur={handleBlur}
              id='LastName'
              type="name"
              placeholder='Last Name'
              className={errors.LastName && touched.LastName ? "input-error" : ""}
              />
              </div>
               <p className='errors-p'>{errors.LastName}</p>
              <div className="input-div-reg">
              <label htmlFor='birthday'>Birthday <span className="asterisk">*</span></label>
              <input
                id="birthday"
                type="date"
                className="user-input"
                value={values.birthday}
                onChange={handleDateChange}
                onBlur={handleBlur}
                dateFormat="MM//DD/YYYY"
                  />
              </div>
              <p className='errors-p'>{errors.birthday}</p>
              <div className="input-div-reg">
              <label htmlFor='sex'>Sex <span className="asterisk">*</span></label>
                  <select
                    id="sex"
                    className="user-input"
                    value={values.sex}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="" disabled>
                      Sex
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  </div>
                  <p className='errors-p'>{errors.sex}</p>
              <div className="input-div-reg">
              <label htmlFor='contactNum'>Contact No.<span className="asterisk">*</span></label>
                  <input
                    id="contactNum"
                    placeholder=" Contact No."
                    className={errors.contactNum && touched.contactNum ? "input-error" : ""}
                    value={values.contactNum}
                    onChange={handleChange}
                    required
                  />
              </div>
                  <p className='errors-p'>{errors.contactNum}</p>
              <div className="input-div-reg">
                  <label htmlFor="houseNum" className="user-input-label house-input-label">
                    House no.<span className="asterisk">*</span>
                  </label>
                  <input
                    id="houseNum"
                    placeholder=" House no."
                    className={errors.houseNum && touched.houseNum ? "input-error" : ""}
                    value={values.houseNum}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
              </div>
                  <p className='errors-p'>{errors.houseNum}</p>
              <div className="input-div-reg">
                  <label htmlFor="street" className="user-input-label">
                    Street<span className="asterisk">*</span>
                  </label>
                  <input
                    id="street"
                    placeholder=" Street"
                    className={errors.street && touched.street ? "input-error" : ""}
                    value={values.street}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
              </div>
                  <p className='errors-p'>{errors.street}</p>
              <div className="input-div-reg">
                  <label htmlFor="brgy" className="user-input-label">
                    Barangay<span className="asterisk">*</span>
                  </label>
                  <input
                    id="brgy"
                    placeholder=" Barangay"
                    className={errors.brgy && touched.brgy ? "input-error" : ""}
                    value={values.brgy}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  </div>
                  <p className='errors-p'>{errors.brgy}</p>
                  <div className="input-div-reg">
                  <label htmlFor="city" className="user-input-label">
                   City/Municipality<span className="asterisk">*</span>
                  </label>
                  <input
                    id="city"
                    placeholder=" City/Municipality"
                    className={errors.city && touched.city ? "input-error" : ""}
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  </div>
                  <p className='errors-p'>{errors.city}</p>
                  <div className="input-div-reg">
                   <label htmlFor="prov" className="user-input-label">
                    Province<span className="asterisk">*</span>
                  </label>
                  <input
                    id="prov"
                    placeholder=" Province"
                    className={errors.prov && touched.prov ? "input-error" : ""}
                    value={values.prov}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  </div>
                  <p className='errors-p'>{errors.prov}</p>
                  <div className="input-div-reg">
                  <label htmlFor="email" className="user-input-label">
                    Email<span className="asterisk">*</span>
                  </label>
                  <input
                    id="email"
                    placeholder=" Email"
                    className={errors.email && touched.email ? "input-error" : ""}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  </div>
                  <p className='errors-p'>{errors.email}</p>
                  <div className="input-div-reg">
                  <label htmlFor="UserName" className="user-input-label">
                    Username<span className="asterisk">*</span>
                  </label>
                  <input
                    id="UserName"
                    placeholder=" Username"
                    className={errors.UserName && touched.UserName ? "input-error" : ""}
                    value={values.UserName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  </div>
                  <p className='errors-p'>{errors.UserName}</p>
                  <div className="input-div-reg">
                  <label htmlFor="password" className="user-input-label">
                    Password<span className="asterisk">*</span>
                  </label>
                  <div className="password-input">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder=" Password"
                      className={errors.password && touched.password ? "input-error" : ""}
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="eye-icon" onClick={togglePasswordVisibility}>
                      {showPassword ? <RiEyeCloseFill /> : <RiEyeFill />}
                    </span>
                  </div>
                </div>
                  <p className='errors-p'>{errors.password}</p>
                  <div className="input-div-reg">
                  <label htmlFor="confirmpassword" className="user-input-label">
                    Confirm Password<span className="asterisk">*</span>
                  </label>
                  <div className="password-input">
                    <input
                      id="confirmpassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder=" Confirm Password"
                      className={errors.confirmpassword && touched.confirmpassword ? "input-error" : ""}
                      value={values.confirmpassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <RiEyeCloseFill /> : <RiEyeFill />}
                    </span>
                  </div>
                </div>
                  <p className='errors-p'>{errors.confirmpassword}</p>
              <div className="terms">
                <Link onClick={handleTermsLinkClick}>
                  <p id="terms-p">Terms of Use and Privacy Policy</p>
                </Link>
                {openModal && <Terms closeModal={handleCloseModal}/>}
              </div>
              <button type='submit' id="register-btn">Submit</button>
            </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}