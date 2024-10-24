import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { AppContext } from './AppContext';

const validationSchema = Yup.object({
    doctorId: Yup.number().positive().integer()
        .required('Doctor is required'),
    rating: Yup.number()
        .min(0, 'Rating must be between 1 and 5')
        .max(5, 'Rating must be between 1 and 5')
        .required('Rating is required'),
    comment: Yup.string()
        .max(50, 'Comment must be 50 characters or less')
        .required('Comment is required')
});

function CreateReview() {
                //{doctors}
                
    const {doctors, divStyle, formStyle} = useContext(AppContext)

    const handleSubmit = (values, { resetForm }) => {
        const reviewData = {
            ...values,
            rating: Number(values.rating),
        };
        fetch('/createreview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Review submitted successfully!');
            resetForm();
        })
        .catch(error => {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. You must have an account and be signed in to submit a review.');
        });
    };

    return (
        <div style={divStyle}>
            <h2>Create a Review</h2>
            <h4>(Users must be logged in or have an account to leave a review)</h4>
            <Formik
                initialValues={{ doctorId: '', rating: '', comment: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form style={formStyle}>
                        <section>
                            <label htmlFor="doctorId">Select Doctor: </label>
                            <Field as="select" name="doctorId">
                                <option value="">Select a doctor...</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="doctorId" component="div" />
                        </section>
                        <br />
                        <section>
                            <label htmlFor="rating">Rating (1-5): </label>
                            <Field name="rating" type="number" min="1" max="5" />
                            <ErrorMessage name="rating" component="div" />
                        </section>
                        <br />
                        <section>
                            <label htmlFor="comment">Comment: </label>
                            <Field as="textarea" name="comment" />
                            <ErrorMessage name="comment" component="div" />
                        </section>
                        <br />
                        <button type="submit">Submit Review</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default CreateReview;
