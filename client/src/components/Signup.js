import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required'),
    age: Yup.number().positive().integer()
        .min(18, 'Age must be between 18 and 90')
        .max(90, 'Age must be between 18 and 90')
        .required('Age is required'),
    username: Yup.string()
        .required('Username is required')
});

function Signup() {
    
    const handleSubmit = (values, { resetForm }) => {
        const reviewData = {
            ...values,
            rating: Number(values.age),
        };
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.Error || 'Network response was not ok');
                })
            }
            return response.json();
        })
        .then(data => {
            alert('User created successfully!');
            resetForm();
        })
        .catch(error => {
            console.error('Error creating user:', error);
            alert('Failed to create user.');
        });
    };

    return (
        <div>
            <h2>Signup to leave a review!</h2>
            <Formik
                initialValues={{ name: '', age: '', username: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <div>
                            <label htmlFor="name">Name: </label>
                            <Field as="textarea" name="name" />
                            <ErrorMessage name="name" component="div" />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="age">Age: </label>
                            <Field name="age" type="number" min="18" max="90" />
                            <ErrorMessage name="age" component="div" />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="username">Username: </label>
                            <Field as="textarea" name="username" />
                            <ErrorMessage name="username" component="div" />
                        </div>
                        <br />
                        <button type="submit">Create User</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Signup;