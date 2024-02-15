import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';

import useSignIn from '../hooks/useSignIn';
import { CREATE_USER } from '../graphql/mutations';

import Button from './Button';


const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  errorText: {
    marginTop: 5,
    color: 'red', // You can use your theme colors here
  },
});

const initialValues = {
  username: '',
  password: '',
  passwordConfirmation: '',
};

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .min(1, 'Username must be at least 1 character long')
    .max(30, 'Username must be at most 30 characters long')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters long')
    .max(50, 'Password must be at least 50 characters long')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf(
      [yup.ref('password'), null],
      'Password confirmation must match the password',
    )
    .required('Password confirmation is required'),
});

const SignUpForm = ({ formik }) => {
  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <TextInput
          placeholder="Username"
          onChangeText={formik.handleChange('username')}
          value={formik.values.username}
          style={{
            borderColor: formik.touched.username && formik.errors.username ? 'red' : 'gray',
            borderWidth: 1,
            padding: 10,
          }}
        />
        {formik.touched.username && formik.errors.username && (
        <Text style={styles.errorText}>{formik.errors.username}</Text>
      )}
      </View>

      <View style={styles.fieldContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={formik.handleChange('password')}
          value={formik.values.password}
          style={{
            borderColor: formik.touched.password && formik.errors.password ? 'red' : 'gray',
            borderWidth: 1,
            padding: 10,
          }}
        />
        {formik.touched.password && formik.errors.password && (
        <Text style={styles.errorText}>{formik.errors.password}</Text>
      )}
      </View>

      <View style={styles.fieldContainer}>
        <TextInput
          placeholder="Password confirmation"
          secureTextEntry
          onChangeText={formik.handleChange('passwordConfirmation')}
          value={formik.values.passwordConfirmation}
          style={{
            borderColor: formik.touched.passwordConfirmation && formik.errors.passwordConfirmation ? 'red' : 'gray',
            borderWidth: 1,
            padding: 10,
          }}
        />
        {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
        <Text style={styles.errorText}>{formik.errors.passwordConfirmation}</Text>
      )} 
      </View>

      <Button onPress={formik.handleSubmit} testID="submitButton">
        Sign up
      </Button>
    </View>
  );
};

const SignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const { username, password } = values;

      const user = {
        username,
        password,
      };

      await createUser({ variables: { user } });
      await signIn(user);

      navigate('/', { replace: true });
    },
    validationSchema,
  });

  return <SignUpForm formik={formik} />;
};

export default SignUp;
