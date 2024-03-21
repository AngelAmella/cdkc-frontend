import * as yup from 'yup'

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const numberRules = /^[0-9]+$/;
const userNameRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRule = /^[\w-.]+@(gmail|yahoo|outlook)\.(com)$/;
const alphaOnlyRule = /^[A-Za-z\s,]+$/; //allows spacing & COMMA
const numberAndDecimalRule = /^[0-9]+(\.[0-9]+)?$/;

const bloodRule = /^\d{2,3}\/\d{2,3}$/; //FORMAT BLOOD PRESSURE
const temperatureRule = /^\d+(\.\d+)?$/; //E.G 27.5



export const registerSchema = yup.object().shape({
    FirstName: yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'First Name must only contain letters.').required("First Name required."),
    MiddleName:yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'Middle Name must only contain letters.').required("Middle Name required."),
    LastName:yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'Last Name must only contain letters.').required("Last Name required."),
    
    birthday:yup.string().required("Birthday is required."),
    sex:yup.string().oneOf(["Male", "Female"], 'Please select gender.').required("Gender is required."),
    contactNum:yup.string().max(11, 'Reached maximum quantity of digits.').matches(numberRules, 'Contact number must only contain numbers.').required("Contact Number is required."),
    
    houseNum:yup.string().max(30, 'Reached maximum quantity of characters.').required("House number required."),
    street:yup.string().max(20, 'Reached maximum quantity of characters.').required("Street required."),
    brgy:yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'Barangay must only contain letters.').required("Barangay required."),
    city:yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'City must only contain letters.').required("City required."),
    prov:yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'Province must only contain letters.').required("Province required."),

    email:yup.string().email('Invalid email format.')
    .matches(emailRule, 'Email must be from gmail, yahoo, or outlook.')
    .required("Email is required.")
    .test('unique-email', 'Email already exists.', async function (value) {
        if (value) {
          try {
            const response = await axios.get(`http://localhost:5000/api/user?email=${value}`);
            return !response.data.exists; // Assuming the response has a property indicating whether the email exists
          } catch (error) {
            console.error('Error checking email existence:', error);
            return true; 
          }
        }
        return true; 
      }),
   
    UserName:yup.string()
    .matches(userNameRules, 'Username must contain at least one number, one uppercase letter, and one lowercase letter.')
    .min(8, 'Username must be at least 8 characters long.' ).required("UserName is required.")
    .max(12, 'Reached maximum quantity of characters.')
    .required("Username is required.")
    .test('unique-username', 'Username already exists.', async function(value) {
      if (value) {
          try {
              const response = await axios.get(`http://localhost:5000/api/user?username=${value}`);
              return !response.data.exists; 
          } catch (error) {
              console.error('Error checking username existence:', error);
              return true; 
          }
      }
      return true; 
  }),

    password:yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .matches(passwordRules, "Password must contain at least one uppercase, one lowercase letter, and one digit.")
    .required("Please enter a password."),

    confirmpassword:yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match.')
    .required("Confirm Password required."),
})

// ADMIN
export const reportSchema = yup.object().shape({
  selectedType:yup.string().oneOf(["Appointments", "Records", "Inventory", "Users", "Orders"], 'Please select parameters.').required("Please select Parameters"),
  firstParams:yup.string().max(35, 'Maximum Characters entered').required("Query required."),
})

export const suppliesSchema = yup.object().shape({

  itemName: yup.string().max(30, "Maximum characters reached.").min(5, "Product name must be at least 5 minimum.").matches(alphaOnlyRule, "Product Name must only contain letters.").required('Product Name required.'),
  itemDescription: yup.string().max(40, "Maximum characters reached.").min(5, "Description must be at least 5 minimum.").matches(alphaOnlyRule, "Product Description must only contain letters.").required('Product Description required.'),
  stocksAvailable: yup.string().max(5, "Maximum digits reached.").min(2, "Must be atleast two digits.").matches(numberRules, "Availability must only contain numbers.").required("Stock availability required."),
  itemPrice:yup.string().max(5,"Maximum digits reached.").min(2, "Must be at least two digits.").matches(numberAndDecimalRule, "e.g 12.45 of input").required('Item Price required'),
  expireDate: yup.string()
  .required('Expiration Date is required.')
  .test('future-date', 'Date must not expire 2 weeks from now.', function (value) {
    if (!value) return true; // Pass if value is not provided
    const currentDate = new Date();
    const selectedDate = new Date(value);
    const twoWeeksFromNow = new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000)); // Adding two weeks in milliseconds
    return selectedDate > twoWeeksFromNow;
  }),
  itemImg: yup.mixed().test('fileType', 'Image file required', (value) => {
    if (!value) return false; 
    return value instanceof File;
  })
})

export const recordSchema = (users) => {
  return yup.object().shape({
    patientName: yup.string().oneOf(users.map(user => user.UserName), 'Please select User.').required('Please select User.'),
    weight: yup.string().min(4, 'Must be at least 10kg').max(5, 'e.g 50kg or 100kg').required("Weight required"),
    height: yup.string().min(4, 'e.g 4\'11"').max(5, 'e.g 4\'11"').required("Height required"),
    age: yup.string().min(2, "Must be at least 18 years old").max(3, "Wow, hundreds?").required("Age required"),
    sex: yup.string().oneOf(["Male", "Female"], "Please select gender.").required("Gender required.")
  });
};

export const histoSchema = yup.object().shape({
  patientObjectId: yup.string().required("Enter patient's Record ID from the table"),
  bloodPressure: yup.string()
    .matches(bloodRule, 'Format "XXX/YYY".')
    .min(6, 'e.g 120/80')
    .max(7, 'e.g 120/100')
    .required('Blood pressure is required'),
  temperature:yup.string()
    .min(2, 'e.g 38')
    .max(4, 'e.g 37.5')
    .matches(temperatureRule, 'Must be a valid number')
    .required('Temperature is required'),
  allergies:yup.string()
    .min(4, 'Must be atleast 4 letters.')
    .max(50, 'Allergy name is too long, please enter a shorter name.')
    .matches(alphaOnlyRule, 'Must only contain letters.')
    .required('Allergy required, if none put None'),
  diagnosis:yup.string()
    .matches(alphaOnlyRule, 'Must only contain letters')
    .min(3, 'Must be at least 3 letters.')
    .max(50, 'Diagnostic name is too long, please enter a shorter name.')
    .required('Diagnosis required, if none put None'),
  surgeries:yup.string()
    .min(4, 'Must be atleast 4 letters.')
    .max(500,'Symptoms too long')
    .matches(alphaOnlyRule, "Must only contain letters.")
    .required('Symptoms required, if none put None')
})