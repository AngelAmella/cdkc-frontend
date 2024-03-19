import React, { useState } from 'react';
import '../supplies.css';
import {useFormik} from 'formik'
import { suppliesSchema } from '../../../components/schema/schemaindex';
import axios from 'axios';
// import Button from './buttons';
// import Head2 from '../../../components/headers/header';
// import DatePicker from 'react-datepicker';

export default function SuppliesForm() {
  const {values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue} = useFormik({
    initialValues:{
      itemName:'',
      itemDescription:'',
      stocksAvailable:'',
      itemPrice: '',
      expireDate:'',
      itemImg: '',
    },
    validationSchema:suppliesSchema,
    onSubmit: async (values) => { 
      try {
        const formData = new FormData();
        formData.append('itemName', values.itemName);
        formData.append('itemDescription', values.itemDescription);
        formData.append('stocksAvailable', values.stocksAvailable);
        formData.append('itemPrice', values.itemPrice);
        formData.append('expireDate', values.expireDate);
        formData.append('itemImg', values.itemImg)

        const result = await axios.post('http://localhost:5000/api/inventory', formData);

        // Handle any further actions after successful submission
        console.log('Submission successful:', result.data);
        alert('New Product added.')
        // Clear the form fields after successful submission
        setFieldValue('itemName', '');
        setFieldValue('itemDescription', '');
        setFieldValue('stocksAvailable', '');
        setFieldValue('itemPrice', '');
        setFieldValue('expireDate', '');
        setFieldValue('itemImg',null);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    },
  })

  const handleImageChange = (e) => {
      setFieldValue('itemImg', e.target.files[0]);
      alert('Image successfully uploaded') 
      {/*`````````````````NEW CODE*/}
    };
  // const [itemName, setNewItem] = useState('');
  // const [itemDescription, setDescription] = useState('');
  // const [stocksAvailable, setStocks] = useState('');
  // const [itemPrice, setPrice] = useState('');
  // const [itemImg, setImage] = useState(null);
  // const [expireDate, setExpireDate] = useState(new Date());
  // const [Supplies, setSuppliesList] = useState([]);

  // const handleImageChange = (e) => {
  //   // Update the state with the selected image file
  //   setImage(e.target.files[0]);
  //   alert('Image successfully uploaded') 
  //   {/*`````````````````NEW CODE*/}
  // };

  // const handleExpireDateChange = (expireDate) => {
  //   setExpireDate(expireDate);
  // };

  // const onSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const formData = new FormData();
  //     formData.append('itemName', itemName);
  //     formData.append('itemDescription', itemDescription);
  //     formData.append('stocksAvailable', stocksAvailable);
  //     formData.append('itemPrice', itemPrice);
  //     formData.append('expireDate', expireDate);
  //     formData.append('itemImg', itemImg);

  //     const result = await axios.post('http://localhost:5000/api/inventory', formData);

  //     // Update the state with the new stock data
  //     setSuppliesList([...Supplies, result.data]);

  //     // Clear the form fields after successful submission
  //     setNewItem('');
  //     setDescription('');
  //     setStocks('');
  //     setPrice('');
  //     setImage(null);
  //     setExpireDate(new Date());
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <>
      <form className="create-stocks" autoComplete='off' onSubmit={handleSubmit}>
      <div className='form-create-stocks'>
      <div className='sup-valid-input'>
      <label htmlFor='itemName'>New Product</label>
      <input
          id="itemName"
          type="text"
          value={values.itemName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" New Item"
          className={errors.itemName && touched.itemName ? "sup-input-error": "input-supplies"}
        />
        <p className='sup-errors-p'>{errors.itemName}</p>
        </div>
      <div className='sup-valid-input'>
      <label htmlFor='itemDescription'></label>
      <input
          id="itemDescription"
          type="text"
          value={values.itemDescription}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" Item Description"
          className={errors.itemDescription && touched.itemDescription ? "sup-input-error": "input-supplies"}
        />
         <p className='sup-errors-p'>{errors.itemDescription}</p>
      </div>
      <div className='sup-valid-input'>
      <label htmlFor='stocksAvailable'></label>
      <input
          id="stocksAvailable"
          type="text"
          value={values.stocksAvailable}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" Availability"
          className={errors.stocksAvailable && touched.stocksAvailable ? "sup-input-error": "input-supplies"}
        />
         <p className='sup-errors-p'>{errors.stocksAvailable}</p>
      </div>
      <div className='sup-valid-input'>
      <label htmlFor='itemPrice'></label>
      <input
          id="itemPrice"
          type="text"
          value={values.itemPrice}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" Item Price"
          className={errors.itemPrice && touched.itemPrice ? "sup-input-error": "input-supplies"}
        />
         <p className='sup-errors-p'>{errors.itemPrice}</p>
      </div>
      <div className='sup-valid-input'>
      <label htmlFor='expireDate'></label>
      <input
          id="expireDate"
          type="date"
          value={values.expireDate}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder=" Expiration Date"
          className={errors.expireDate && touched.expireDate ? "sup-input-error": "input-supplies"}
        />
         <p className='sup-errors-p'>{errors.expireDate}</p>
        </div>
        <div className='sup-valid-input'>
        <label htmlFor='img-upload'></label>
        <input
          id='img-upload'
          type="file"
          values={values.itemImg}
          onChange={handleImageChange}
          onBlur={handleBlur}
          accept="image/*"
          className={errors.itemImg && touched.itemImg ? "sup-input-error": "input-supplies"}
        />
         <p className='sup-errors-p'>{errors.itemImg}</p>
        </div>
        <button type='submit' id='sup-add'>Add</button>
        </div>
        </form>
    </>
  );
}
      {/* <div className='form-create-stocks'> {/*NEW CODE*
        <Head2 text="Enter a Stock" id="inventory-header"></Head2>
        <input
          type="text"
          value={itemName}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder=" New Item"
          className="input-supplies"
        />
        <input
          type="text"
          value={itemDescription}
          onChange={(e) => setDescription(e.target.value)}
          placeholder=" Item Description"
          className="input-supplies"
        />
        <input
          type="text"
          value={stocksAvailable}
          onChange={(e) => setStocks(e.target.value)}
          placeholder=" Stocks Available"
          className="input-supplies"
        />
        <input
          type="text"
          value={itemPrice}
          onChange={(e) => setPrice(e.target.value)}
          placeholder=" Item Price"
          className="input-supplies"
        />
        <div className="expiration-container">
          <label htmlFor='expire-date' id='label-expire'>Expiration Date</label>
          <DatePicker
            placeholderText="Expiration Date"
            className="custom-expireDate custom-datepicker"
            selected={expireDate}
            value={expireDate}
            onChange={handleExpireDateChange}
            id="expire-date"
            required
          />
        </div>

        {/* Add an input field for image upload 
        <input
          id='img-upload'
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="input-supplies"
        />

        <Button text={'Add'} type="submit"></Button>
        </div> */}
      
