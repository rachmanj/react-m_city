import React, { useState } from 'react';
import { Fade } from 'react-awesome-reveal';
import { CircularProgress } from '@material-ui/core';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { showSuccessToast, showErrorToast } from '../../utils/tools';
import { promotionsCollection } from '../../../firebase';

function Enroll() {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email')
        .required('The email is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
      submitForm(values);
    },
  });

  const submitForm = async values => {
    try {
      const isOnTheList = await promotionsCollection
        .where('email', '==', values.email)
        .get();

      if (isOnTheList.docs.length >= 1) {
        showErrorToast('Sorry you are already on the list');
        setLoading(false);
        return false;
      }
      await promotionsCollection.add({ email: values.email });
      formik.resetForm();
      setLoading(false);
      showSuccessToast('Congratulation !!!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fade>
      <div className="enroll_wrapper">
        <form onSubmit={formik.handleSubmit}>
          <div className="enroll_title">Enter your email</div>
          <div className="enroll_input">
            <input
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email"
            />

            {formik.touched.email && formik.errors.email ? (
              <div className="errors_label">{formik.errors.email}</div>
            ) : null}

            {loading ? (
              <CircularProgress color="secondary" className="progress" />
            ) : (
              <button type="submit">Enroll</button>
            )}
          </div>
        </form>
      </div>
    </Fade>
  );
}

export default Enroll;
