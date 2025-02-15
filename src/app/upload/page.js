"use client";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";

export default function EmailForm() {
  const [generatedFiles, setGeneratedFiles] = useState([]);

  const initialValues = {
    emails: "",
    subject: "",
    message: "",
  };

  const validationSchema = Yup.object({
    emails: Yup.string()
      .required("Recipient emails are required")
      .test("valid-emails", "Invalid email format", (value) => {
        return value
          .split(",")
          .map((email) => email.trim())
          .every((email) => /\S+@\S+\.\S+/.test(email));
      }),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
  });

  const processFile = async (event, setFieldValue) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.endsWith(".xls") && !file.name.endsWith(".xlsx")) {
      toast.error("❌ Only Excel files are allowed!");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const expectedHeaders = [
        "Global Event ID",
        "Delivery Time (Local)",
        "Event Type",
        "Creater Name",
        "VIN",
        "Email",
      ];

      const fileHeaders = jsonData[0].map((header) => header.trim());
      const isValidHeaders = expectedHeaders.every((expectedHeader) =>
        fileHeaders.some(
          (fileHeader) => fileHeader.toLowerCase() === expectedHeader.toLowerCase()
        )
      );

      if (!isValidHeaders) {
        toast.error("❌ Invalid file headers. Please check the template.");
        return;
      }

      const emailIndex = fileHeaders.findIndex(
        (header) => header.toLowerCase() === "email"
      );

      if (emailIndex === -1) {
        toast.error("❌ 'Email' column is missing!");
        return;
      }

      const emailDataMap = new Map();

      jsonData.slice(1).forEach((row) => {
        const email = row[emailIndex]?.trim();
        if (email && /\S+@\S+\.\S+/.test(email)) {
          if (!emailDataMap.has(email)) {
            emailDataMap.set(email, []);
          }
          emailDataMap.get(email).push(row);
        }
      });

      if (emailDataMap.size === 0) {
        toast.error("❌ No valid emails found in the file.");
        return;
      }

      setFieldValue("emails", Array.from(emailDataMap.keys()).join(", "));

      const files = [];
      emailDataMap.forEach((data, email) => {
        const ws = XLSX.utils.aoa_to_sheet([fileHeaders, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        const fileBlob = new Blob(
          [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
          { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
        );

        const fileURL = URL.createObjectURL(fileBlob);

        files.push({ email, fileURL });
      });

      setGeneratedFiles(files);
      toast.success("✅ File processed successfully!");
    };

    reader.readAsArrayBuffer(file);
  };

  const sendEmail = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("✅ Email sent successfully!");
        resetForm();
        setGeneratedFiles([]);
      } else {
        toast.error(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      toast.error("❌ Failed to send email. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow-lg" style={{ width: "500px" }}>
          <h2 className="text-center">Send Email</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={sendEmail}
          >
            {({ values, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={(e) => processFile(e, setFieldValue)}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    name="emails"
                    placeholder="Recipient Emails (comma separated)"
                    value={values.emails}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  />
                  <ErrorMessage
                    name="emails"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Subject Input */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={values.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Message Input */}
                <div className="mb-3">
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-control"
                    rows="4"
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {generatedFiles.length > 0 && (
                  <div className="mb-3">
                    <h5>Generated Files</h5>
                    <ul>
                      {generatedFiles.map(({ email, fileURL }, index) => (
                        <li key={index} className="d-flex align-items-center">
                          <span className="me-2">File for: {email}</span>
                          <a href={fileURL} download={`file_for_${email}.xlsx`} className="text-success">
                            <FaDownload size={20} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-100"
                >
                  {isSubmitting ? "Sending..." : "Send Email"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
