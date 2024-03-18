import * as yup from 'yup'

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const contactRules = /^[0-9]+$/;
const userNameRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRule = /^[\w-.]+@(gmail|yahoo|outlook)\.(com)$/;
const alphaOnlyRule = /^[A-Za-z]+$/;

export const registerSchema = yup.object().shape({
    FirstName: yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'First Name must only contain letters.').required("First Name required."),
    MiddleName:yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'Middle Name must only contain letters.').required("Middle Name required."),
    LastName:yup.string().max(20, 'Reached maximum quantity of characters.').matches(alphaOnlyRule, 'Last Name must only contain letters.').required("Last Name required."),
    
    birthday:yup.string().required("Birthday is required."),
    sex:yup.string().oneOf(["Male", "Female"], 'Please select gender.').required("Gender is required."),
    contactNum:yup.string().max(11, 'Reached maximum quantity of digits.').matches(contactRules, 'Contact number must only contain numbers.').required("Contact Number is required."),
    
    houseNum:yup.string().max(20, 'Reached maximum quantity of characters.').required("House number required."),
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



export const reportSchema = yup.object().shape({
  selectedType:yup.string().oneOf(["Appointments", "Records", "Inventory", "Users", "Orders"], 'Please select parameters.').required("Please select Parameters"),
  firstParams:yup.string().max(35, 'Maximum Characters entered').required("Query required."),
})