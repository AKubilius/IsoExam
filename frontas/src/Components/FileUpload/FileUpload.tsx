import React, { useState } from 'react';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [response, setResponse] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        setFile(selectedFile || null);
    };

   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("File submission initiated."); // Log start

    if (!file) {
        alert("Please select a file first!");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("https://localhost:7285/api/upload", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            console.error("Server responded with an error:", res.statusText);
            throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();
        setResponse(data.text);
        console.log("File uploaded and processed successfully."); // Log success
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("There was an error uploading the file. Check the console for details.");
    }
};

    return (
        <div>
            <h3>Upload a Word Document</h3>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".docx" onChange={handleFileChange} />
                <button type="submit">Upload and Read</button>
            </form>
            <div>
                <h4>Extracted Text:</h4>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default FileUpload;
