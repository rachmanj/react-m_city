import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout';
import Fileuploader from '../../utils/fileUploader';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  showSuccessToast,
  showErrorToast,
  textErrorHelper,
  selectErrorHelper,
  selectIsError,
} from '../../utils/tools';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from '@material-ui/core';
import { playersCollection, firebase } from '../../../firebase';

const defaultValues = {
  name: '',
  lastname: '',
  number: '',
  position: '',
  image: '',
};

const AddEditPlayers = props => {
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState('');
  const [values, setValues] = useState(defaultValues);
  const [defaultImg, setDefaultImg] = useState('');

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: values,
    validationSchema: Yup.object({
      name: Yup.string().required('This field is required'),
      lastname: Yup.string().required('This field is required'),
      number: Yup.number()
        .required('This field is required')
        .min(0, 'Minimun is zero')
        .max(100, 'Maximum is 100'),
      position: Yup.string().required('This field is required'),
      image: Yup.string().required('This field is required'),
    }),
    onSubmit: values => {
      submitForm(values);
    },
  });

  const submitForm = values => {
    let dataToSubmit = values;
    setLoading(true);

    if (formType === 'add') {
      playersCollection
        .add(dataToSubmit)
        .then(() => {
          showSuccessToast('Player added');
          formik.resetForm();
          props.history.push('/admin_players');
        })
        .catch(error => {
          showErrorToast(error);
        });
    } else {
      playersCollection
        .doc(props.match.params.playerid)
        .update(dataToSubmit)
        .then(() => {
          showSuccessToast('Player updated');
        })
        .catch(error => {
          showErrorToast(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const param = props.match.params.playerid;
    if (param) {
      playersCollection
        .doc(param)
        .get()
        .then(snapshot => {
          if (snapshot.data()) {
            firebase
              .storage()
              .ref('players')
              .child(snapshot.data().image)
              .getDownloadURL()
              .then(url => {
                updateImageName(snapshot.data().image);
                setDefaultImg(url);
              });

            setFormType('edit');
            setValues(snapshot.data());
          } else {
            showErrorToast('Data not found');
          }
        })
        .catch(error => {
          showErrorToast(error);
        });
    } else {
      setFormType('add');
      setValues(defaultValues);
    }
  }, [props.match.params.playerid]);

  const updateImageName = filename => {
    formik.setFieldValue('image', filename);
  };

  const resetImage = () => {
    formik.setFieldValue('image', '');
    setDefaultImg('');
  };

  return (
    <AdminLayout title={formType === 'add' ? 'Add Player' : 'Edit Player'}>
      <div className="editplayers_dialog_wrapper">
        <div>
          <form onSubmit={formik.handleSubmit}>
            <FormControl error={selectIsError(formik, 'image')}>
              <Fileuploader
                dir="players"
                defaultImg={defaultImg}
                defaultImgName={formik.values.image}
                filename={filename => updateImageName(filename)}
                resetImage={() => resetImage()}
              />
              {selectErrorHelper(formik, 'image')}
            </FormControl>
            <hr />
            <h4>Player Info</h4>
            <div className="mb-5">
              <FormControl>
                <TextField
                  id="name"
                  name="name"
                  variant="outlined"
                  label="First Name"
                  placeholder="Add First Name"
                  {...formik.getFieldProps('name')}
                  {...textErrorHelper(formik, 'name')}
                />
              </FormControl>
            </div>
            <div className="mb-5">
              <FormControl>
                <TextField
                  id="lastname"
                  name="lastname"
                  variant="outlined"
                  label="Last Name"
                  placeholder="Add Last Name"
                  {...formik.getFieldProps('lastname')}
                  {...textErrorHelper(formik, 'lastname')}
                />
              </FormControl>
            </div>
            <div className="mb-5">
              <FormControl>
                <TextField
                  type="number"
                  id="number"
                  name="number"
                  variant="outlined"
                  label="Number"
                  placeholder="Add Number"
                  {...formik.getFieldProps('number')}
                  {...textErrorHelper(formik, 'number')}
                />
              </FormControl>
            </div>
            <div className="mb-5">
              <FormControl error={selectIsError(formik, 'position')}>
                <TextField
                  id="position"
                  select
                  name="position"
                  variant="outlined"
                  label="Position"
                  displayEmpty
                  {...formik.getFieldProps('position')}
                >
                  <MenuItem value="" disabled>
                    Select a position
                  </MenuItem>
                  <MenuItem value="Keeper">Keeper</MenuItem>
                  <MenuItem value="Defense">Defense</MenuItem>
                  <MenuItem value="Midfield">Midfield</MenuItem>
                  <MenuItem value="Striker">Striker</MenuItem>
                </TextField>
                {selectErrorHelper(formik, 'position')}
              </FormControl>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {formType === 'add' ? 'Add Player' : 'Edit Player'}
            </Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddEditPlayers;
