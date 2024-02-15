import React from 'react';
import { StyleSheet, View, TextInput, Text } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from './Button';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  buttonContainer: {
    backgroundColor: theme.colors.submitButton,
    padding: 15,
  },
  errorText: {
    marginTop: 5,
    color: 'red', // You can use your theme colors here
  },
});

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignInForm = ({ formik }) => (
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
    <Button onPress={formik.handleSubmit} title="Sign in" />
  </View>
);

const SignIn = () => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return <SignInForm formik={formik} />;
};

export default SignIn;
