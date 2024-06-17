// client/src/components/FileUpload.js
import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUpload }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            await axios.post('http://localhost:5000/api/data/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('File uploaded successfully!');
            onUpload();
        } catch (error) {
            console.error('Error uploading file:', error.message);
            alert('Error uploading file. Please try again.');
        }
    };

    return (
        <div>
            <h2>Upload JSON File</h2>
            <input type="file" accept=".json" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!file}>
                Upload
            </button>
        </div>
    );
};

export default FileUpload;