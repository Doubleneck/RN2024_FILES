import { StyleSheet, View, TextInput, Text } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';

import Button from './Button';
//import FormikTextInput from './FormikTextInput';
import { CREATE_REVIEW } from '../graphql/mutations';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 15,
  },
  fieldContainer: {
    marginBottom: 15,
  },
});

const initialValues = {
  repositoryName: '',
  ownerName: '',
  rating: '',
  text: '',
};

const validationSchema = yup.object().shape({
  repositoryName: yup.string().required('Repository name is required'),
  ownerName: yup.string().required('Repository owner name is required'),
  rating: yup
    .number('Rating must be a number')
    .min(0, 'Rating must be greater or equal to 0')
    .max(100, 'Rating must be less or equal to 100')
    .required('Rating is required'),
  text: yup.string(),
});

const CreateReviewForm = ({ formik }) => {
  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
      <TextInput
        placeholder="Repository owner name"
        onChangeText={formik.handleChange('ownerName')}
        value={formik.values.ownerName}
        style={{
          borderColor: formik.touched.ownerName && formik.errors.ownerName ? 'red' : 'gray',
          borderWidth: 1,
          padding: 10,
        }}
      />
      {formik.touched.ownerName && formik.errors.ownerName && (
        <Text style={styles.errorText}>{formik.errors.ownerName}</Text>
      )}
      </View>

      <View style={styles.fieldContainer}>
        <TextInput
          placeholder="Repository name"
          onChangeText={formik.handleChange('repositoryName')}
          value={formik.values.repositoryName}
          style={{
            borderColor: formik.touched.repositoryName && formik.errors.repositoryName? 'red' : 'gray',
            borderWidth: 1,
            padding: 10,
          }}
        />
        {formik.touched.repositoryName && formik.errors.repositoryName && (
          <Text style={styles.errorText}>{formik.errors.repositoryName}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <TextInput
          placeholder="Rating between 0 and 100"
          keyboardType="numeric"
          onChangeText={formik.handleChange('rating')}
          value={formik.values.rating}
          style={{
            borderColor: formik.touched.rating && formik.errors.rating? 'red' : 'gray',
            borderWidth: 1,
            padding: 10,
          }}
        />
      </View>
      <View style={styles.fieldContainer}>
        <TextInput
        placeholder="Review"
        onChangeText={formik.handleChange('text')}
        multiline
        value={formik.values.text}
        style={{
          borderColor: formik.touched.rating && formik.errors.rating? 'red' : 'gray',
          borderWidth: 1,
          padding: 10,
        }}
      />
      </View>

      <Button onPress={formik.handleSubmit}>Create a review</Button>
    </View>
  );
};
//<FormikTextInput placeholder="Review" name="text" multiline />
const CreateReview = () => {
  const [createReview] = useMutation(CREATE_REVIEW);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      const review = {
        ...values,
        rating: parseInt(values.rating),
      };

      const { data } = await createReview({ variables: { review } });

      if (data?.createReview) {
        navigate(`/repositories/${data.createReview.repositoryId}`);
      }
    },
    validationSchema,
  });

  return <CreateReviewForm formik={formik} />;
};


export default CreateReview;
