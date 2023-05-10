import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

async function uploadImage(containerName, file) {
  const blobServiceClient = new BlobServiceClient(
    "connection-string-to-your-storage-account + sas tokken"
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(file.name);
  const blockBlobClient = blobClient.getBlockBlobClient();
  const result = await blockBlobClient.uploadBrowserData(file, {
    blockSize: 4 * 1024 * 1024,
    concurrency: 20,
    onProgress: ev => console.log(ev)
  });
  console.log(`Upload of file '${file.name}' completed`);
}

function ImageUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = event => {
    event.preventDefault();
    uploadImage("your-container-name", file);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload Image</button>

    </form>
  );
}

export default ImageUpload;