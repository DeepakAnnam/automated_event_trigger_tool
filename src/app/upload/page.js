"use client";

export default function Upload() {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        localStorage.setItem("uploadedFile", reader.result);
        alert("File content saved to localStorage!");
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center flex-column"
      style={{ minHeight: "100vh" }}
    >
      <h1>Upload Page</h1>
      <div>
        <input type="file" onChange={handleFileUpload} />
      </div>
    </div>
  );
}
