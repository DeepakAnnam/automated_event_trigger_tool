"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function Upload() {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if the file is an Excel file
    if (!file.name.match(/\.(xls|xlsx)$/)) {
      alert("Please upload a valid Excel file (.xls or .xlsx)");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON

      localStorage.setItem("uploadedExcel", JSON.stringify(jsonData));
      alert("Excel data saved to localStorage!");
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center flex-column"
      style={{ minHeight: "100vh" }}
    >
      <h1>Upload Page</h1>
      <div>
        <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
        {fileName && <p>Uploaded File: {fileName}</p>}
      </div>
    </div>
  );
}
