import React, { useEffect, useState } from "react";
import "./myprofile.css";
import PtnHeader from "../patient-page/components/header";
import PtnSidebar from "../patient-page/components/sidebar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { HiOutlineIdentification } from "react-icons/hi";
import { FiPhoneCall } from "react-icons/fi";
import { AiOutlineHome } from "react-icons/ai";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

export default function MyProfile() {
  const [user, setUser] = useState({
    _id: "",
    UserName: "",
    FirstName: "",
    MiddleName: "",
    LastName: "",
    contactNum: "",
    houseNum: "",
    street: "",
    brgy: "",
    city: "",
    prov: "",
    birthday: "",
    email: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [originalUser, setOriginalUser] = useState({}); 

  const { id } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/" + id)
      .then((result) => {
        setUser(result.data);
        setOriginalUser(result.data); // Store the original user data
      })
      .catch((err) => console.log(err));
  }, [id]);

  const formatBirthday = (birthday) => {
    if (!birthday) return "";
    const formattedDate = new Date(birthday);
    const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
    return formattedDate.toLocaleDateString(undefined, options);
  }

  const handleEditClick = () => {
    setIsEditing(true);

    // Format the birthday to "MM/DD/YYYY" if it's not already in that format
    const formattedBirthday = user.birthday ? formatBirthday(user.birthday) : "";

    setUser({
      ...user,
      birthday: formattedBirthday,
    });
  }

  const handleSaveClick = () => {
    // Send a PUT request to update the user's profile
    axios
      .put("http://localhost:5000/api/user/" + user._id, user)
      .then((result) => {
        // Update the originalUser state to reflect the changes
        setOriginalUser(user);
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
        // Handle the error here
      });
  }

  const handleCancelClick = () => {
    setIsEditing(false);
    // Revert the user data back to its original state
    setUser(originalUser);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Check if the input is empty
    if (value === '') {
      setUser({
        ...user,
        [name]: value,
      });
      return; // Exit the function early if the input is empty
    }
  
    let updatedValue = value;
  
    // Custom validation for first, middle, and last names to accept only letters
    if (["FirstName"].includes(name)) {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        alert(`Invalid input for First Name.`); // Only letters are allowed
        return; // Exit the function if the input is invalid
      } else if (value.length > 20) {
        alert(`First Name should not exceed 20 characters.`);
        updatedValue = value.substring(0, 20); // truncate the value to 20 characters
      }
    }

    if (["MiddleName"].includes(name)) {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        alert(`Invalid input for Middle Name.`); // Only letters are allowed
        return; // Exit the function if the input is invalid
      } else if (value.length > 20) {
        alert(`Middle Name should not exceed 20 characters.`);
        updatedValue = value.substring(0, 20); // truncate the value to 20 characters
      }
    }

    if (["LastName"].includes(name)) {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        alert(`Invalid input for Last Name.`); // Only letters are allowed
        return; // Exit the function if the input is invalid
      } else if (value.length > 20) {
        alert(`Last Name should not exceed 20 characters.`);
        updatedValue = value.substring(0, 20); // truncate the value to 20 characters
      }
    }
  
    // Validation for contact number to accept only numbers and limit to 11 characters
    if (name === 'contactNum') {
      if (!/^\d+$/.test(value)) {
        alert(`Invalid input for contact number`);
        return; // Exit the function if the input is invalid
      } else if (value.length > 11) {
        alert('Contact number should not exceed 11 digits.');
        updatedValue = value.substring(0, 11); // truncate the value to 11 characters
      }
    }
  
    // Validation for birthday to accept only numbers and strict format (MM/DD/YYYY)
    if (name === 'birthday') {
      // Ensure that the input does not exceed 10 characters (MM/DD/YYYY format)
      if (value.length > 10) {
        return;
      }
      // Only allow numbers and '/'
      if (!/^\d{0,2}\/?\d{0,2}\/?\d{0,4}$/.test(value)) {
        alert('Invalid date format');
        return; // Exit the function if the input is invalid
      } else {
        // Split the date components
        const [month, day, year] = value.split('/');
        // Check if month is within range (1-12) and day is within range (1-31)
        if (parseInt(month) > 12 || parseInt(day) > 31) {
          alert('Invalid date format');
          return; // Exit the function if the input is invalid
        }
      }
    }
  
    // Ensure that the "House No." input does not exceed 5 characters and contains only numbers
    if (name === 'houseNum') {
      if (!/^\d+$/.test(value)) {
        alert('Invalid input for House No.'); // Only numbers are allowed.
        return; // Exit the function if the input is invalid
      } else if (value.length > 5) {
        alert('House No. should not exceed 5 characters.');
        updatedValue = value.substring(0, 5); // truncate the value to 5 characters
      }
    }
  
    // Validate "Street" field to allow only numbers, letters, and periods, and limit to 20 characters
    if (name === 'street') {
      if (!/^[A-Za-z0-9. ]+$/.test(value)) {
        alert('Invalid input for Street.'); // Only letters, numbers, and periods are allowed.
        return; // Exit the function if the input is invalid
      } else if (value.length > 20) {
        alert('Street should not exceed 20 characters.');
        updatedValue = value.substring(0, 20); // truncate the value to 20 characters
      }
    }

    // Validate brgy, city, and prov fields to allow only letters and limit to 20 characters
    if (["brgy"].includes(name)) {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        alert(`Invalid input for Barangay.`); // Only letters are allowed
        return; // Exit the function if the input is invalid
      } else if (value.length > 20) {
        alert(`Barangay should not exceed 20 characters.`);
        updatedValue = value.substring(0, 20); // truncate the value to 20 characters
      }
    }

    if (["city"].includes(name)) {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        alert(`Invalid input for City/Municipality.`); // Only letters are allowed
        return; // Exit the function if the input is invalid
      } else if (value.length > 20) {
        alert(`City/Municipality should not exceed 20 characters.`);
        updatedValue = value.substring(0, 20); // truncate the value to 20 characters
      }
    }

    if (["prov"].includes(name)) {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        alert(`Invalid input for Province.`); // Only letters are allowed
        return; // Exit the function if the input is invalid
      } else if (value.length > 20) {
        alert(`Provinceshould not exceed 20 characters.`);
        updatedValue = value.substring(0, 20); // truncate the value to 20 characters
      }
    }
  
    // Validate email field to ensure maximum length of 40 characters
    if (name === 'email') {
      if (value.length > 40) {
        alert('Email should not exceed 40 characters.');
        updatedValue = value.substring(0, 40); // truncate the value to 40 characters
      }
    
    setUser({
      ...user,
      [name]: updatedValue,
    });
  }

    setUser({
      ...user,
      [name]: updatedValue,
    });
  }

  return (
    <>
      <div>
        <PtnHeader/>
        <div className="profile-container">
          <PtnSidebar/>

          <div className="patient-info">
            <h1 id="details-h1">{user.UserName}</h1>

            <div className="patient-details-section">
              <div className="profile-view">
                {user && !isEditing && (
                  <div className="myprofile-details">
                    <p><strong><HiOutlineIdentification id="name-icon"/>&nbsp;&nbsp;&nbsp;</strong>
                      {user.FirstName}&nbsp;
                      {user.MiddleName}&nbsp;
                      {user.LastName}&nbsp;
                    </p>
                    <p><strong><FiPhoneCall id="phone-icon"/>&nbsp;&nbsp;&nbsp;</strong> {user.contactNum}</p>
                    <p><strong><AiOutlineHome id="home-icon"/>&nbsp;&nbsp;&nbsp;</strong>
                      {user.houseNum} &nbsp;
                      {user.street}  &nbsp;
                      {user.brgy} &nbsp;
                      {user.city} &nbsp;
                      {user.prov}
                    </p>
                    <p><strong><LiaBirthdayCakeSolid id="cake-icon" />&nbsp;&nbsp;&nbsp;</strong> {formatBirthday(user.birthday)}</p>
                    <p><strong><MdOutlineMailOutline id="email-icon"/>&nbsp;&nbsp;&nbsp;</strong> {user.email}</p>
                    <button id="edit-btn" onClick={handleEditClick}>Edit</button>
                  </div>
                )}

                {/*----------------------------------- EDIT PROCESS ---------------------------------------- */}

                {user && isEditing && (
                  <div className="edit-myprofile-details">

                    <div className="edit-name-input">
                      <input
                        id="edit-first"
                        type="text"
                        name="FirstName"
                        value={user.FirstName}
                        placeholder="First Name"
                        onChange={handleChange}
                      />

                      <input
                        id="edit-mid"
                        type="text"
                        name="MiddleName"
                        value={user.MiddleName}
                        placeholder="Middle Name"
                        onChange={handleChange}
                      />

                      <input
                        id="edit-last"
                        type="text"
                        name="LastName"
                        value={user.LastName}
                        placeholder="Last Name"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="edit-numbirth-input">
                      <input
                        id="edit-num"
                        type="text"
                        name="contactNum"
                        value={user.contactNum}
                        placeholder="Contact No."
                        onChange={handleChange}
                      />
                      <input
                        id="edit-birth"
                        type="text"
                        name="birthday"
                        value={user.birthday}
                        placeholder="MM/DD/YYYY"
                        onChange={handleChange}
                      />
                    </div>

                    {/* ADDRESS INPUT FIELDS */}
                    <div className="edit-address-input">
                      <input
                        id="edit-house"
                        type="text"
                        name="houseNum"
                        value={user.houseNum}
                        placeholder="House No."
                        onChange={handleChange}
                      />
                      <input
                        id="edit-street"
                        type="text"
                        name="street"
                        value={user.street}
                        placeholder="Street"
                        onChange={handleChange}
                      />
                      <input
                        id="edit-brgy"
                        type="text"
                        name="brgy"
                        value={user.brgy}
                        placeholder="Barangay"
                        onChange={handleChange}
                      />
                      <input
                        id="edit-city"
                        type="text"
                        name="city"
                        value={user.city}
                        placeholder="City/Municipality"
                        onChange={handleChange}
                      />
                      <input
                        id="edit-prov"
                        type="text"
                        name="prov"
                        value={user.prov}
                        placeholder="Province"
                        onChange={handleChange}
                      />
                    </div>
                    {/* END OF ADDRESS INPUT FIELDS */}

                    <div className="edit-handler-input">
                      <input
                        id="edit-email"
                        type="text"
                        name="email"
                        value={user.email}
                        placeholder="Email"
                        onChange={handleChange}
                      />
                      <input
                        id="edit-userName"
                        type="text"
                        name="userName"
                        value={user.UserName}
                        placeholder="Username"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="edit-savecancel">
                      <button id="cancel-btn-myprofile" onClick={handleCancelClick}>Cancel</button>
                      <button id="save-btn-myprofile" onClick={handleSaveClick}>Save</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
