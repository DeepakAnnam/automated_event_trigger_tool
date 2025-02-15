"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Form, Button, Container } from "react-bootstrap";

const ForgotPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: (values) => {
      console.log("Forgot Password Data:", values);
    },
  });

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Reset Password</h3>
        <Form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.email && !!formik.errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* New Password Field */}
          <Form.Group controlId="newPassword" className="mt-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.newPassword && !!formik.errors.newPassword
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.newPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Confirm Password Field */}
          <Form.Group controlId="confirmPassword" className="mt-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                formik.touched.confirmPassword && !!formik.errors.confirmPassword
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.confirmPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100 mt-4">
            Reset Password
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
