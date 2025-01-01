import React, { useState } from "react";
import mammoth from "mammoth"; // For parsing .docx files
import * as pdfjsLib from "pdfjs-dist/webpack"; // For parsing PDFs
import Confetti from "react-confetti"; // For confetti animation

function TranscriptUploader({ onUpload }) {
  const [files, setFiles] = useState([]); // Array of files
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0); // Progress percentage
  const [uploadComplete, setUploadComplete] = useState(false); // Upload success state

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); // Convert FileList to Array
    setFiles(selectedFiles);
    setError("");
    setProgress(0);
    setUploadComplete(false);
    processFiles(selectedFiles); // Start processing automatically
  };

  const processFiles = async (fileList) => {
    const totalFiles = fileList.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = fileList[i];
      try {
        let fileContent;

        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          // Parse .docx files
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          fileContent = result.value;
        } else if (file.type === "text/plain") {
          // Read plain text files
          const reader = new FileReader();
          fileContent = await new Promise((resolve, reject) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
          });
        } else if (file.type === "application/pdf") {
          // Parse PDF files
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let text = "";
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            text += content.items.map((item) => item.str).join(" ") + "\n";
          }
          fileContent = text;
        } else {
          throw new Error("Unsupported file type. Please upload a .docx, .txt, or .pdf file.");
        }

        // Pass the file content to the parent component
        await onUpload(fileContent);

        // Update progress
        setProgress(((i + 1) / totalFiles) * 100);

        // If all files are processed, trigger success
        if (i === totalFiles - 1) {
          setUploadComplete(true);
        }
      } catch (err) {
        console.error(`Error processing file "${file.name}":`, err);
        setError(`Error processing file "${file.name}": ${err.message}`);
      }
    }

    // Reset after processing all files
    setFiles([]);
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept=".docx,.txt,.pdf"
        className="mb-4"
      />
      {progress > 0 && (
        <div style={{ marginTop: "20px" }}>
          <p className="text-center text-gray-800">
            {uploadComplete ? (
              <span className="text-green-600 font-bold">
                Upload success! You can feel free to upload more files.
              </span>
            ) : (
              `Processing Files: ${Math.round(progress)}%`
            )}
          </p>
          <div
            style={{
              width: "100%",
              backgroundColor: "#ddd",
              height: "10px",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: "#4caf50",
                height: "10px",
              }}
            ></div>
          </div>
        </div>
      )}
      {uploadComplete && <Confetti numberOfPieces={200} recycle={false}/>}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default TranscriptUploader;
