import React from "react";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";

export function Register() {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(4, "Too short name!")
      .max(70, "Too long name!")
      .required("First name is required!"),
    lastName: Yup.string()
      .min(3, "Too short last name!")
      .max(10, "Too long last name!")
      .required("Last name is required!"),
    email: Yup.string()
      .email("Invalid email address!")
      .required("Email address is required!"),
    username: Yup.string()
      .min(4, "Too short username!")
      .max(20, "Too long username!")
      .required("A unique username is required!"),
    password: Yup.string()
      .min(8, "Too short password!")
      .max(100, "Too big password!"),
    confirmPassword: Yup.string()
      .min(8, "Too short password!")
      .max(100, "Too big password!"),
  });

  return (
    <div className="register">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          actions.validateForm(values);
        }}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
      >
        {({ errors }) => {
          return (
            <Form className="form">
              <div className="form-header">
                <h2>Join CompCoder!</h2>
              </div>
              <div className="form-errors">
                {errors.firstName ? (
                  <span className="form-error">{errors.firstName}</span>
                ) : null}
                {errors.lastName ? (
                  <span className="form-error">{errors.lastName}</span>
                ) : null}
                {errors.username ? (
                  <span className="form-error">{errors.username}</span>
                ) : null}
                {errors.email ? (
                  <span className="form-error">{errors.email}</span>
                ) : null}

                {errors.password ? (
                  <span className="form-error">{errors.password}</span>
                ) : null}

                {errors.confirmPassword ? (
                  <span className="form-error">{errors.confirmPassword}</span>
                ) : null}
              </div>
              <div className="form-input">
                <Field
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="form-input">
                <Field
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="form-input">
                <Field
                  id="username"
                  name="username"
                  placeholder="Unique Username"
                  required
                />
              </div>
              <div className="form-input">
                <Field
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                />
              </div>
              <div className="form-input">
                <Field
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                />
              </div>
              <div className="form-input">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  type="password"
                  required
                />
              </div>
              <div className="form-buttons">
                <button className="form-button-bg" type="submit">
                  Register
                </button>
                <button className="form-button-nobg" type="button">
                  Already have an account?
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
