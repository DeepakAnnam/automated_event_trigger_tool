"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Card, Form, Button, Container } from "react-bootstrap";
import Link from "next/link";

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Login Data:", values);
    },
  });

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>
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

          {/* Password Field */}
          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.password && !!formik.errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100 mt-4">
            Login
          </Button>

          {/* Links */}
          <div className="text-center mt-3">
            <Link href="/forgot-password" className="text-decoration-none">
              Forgot Password?
            </Link>
          </div>
          <div className="text-center mt-2">
            <Link href="/signup" className="text-decoration-none">
              Don't have an account? Sign Up
            </Link>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
