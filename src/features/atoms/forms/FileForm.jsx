import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

async function uploadImage(containerName, file) {
  const blobServiceClient = new BlobServiceClient.fromConnectionString(
    "BlobEndpoint=https://imagesdoctopus.blob.core.windows.net/;QueueEndpoint=https://imagesdoctopus.queue.core.windows.net/;FileEndpoint=https://imagesdoctopus.file.core.windows.net/;TableEndpoint=https://imagesdoctopus.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=c&sp=rwdlacupiytfx&se=2024-11-05T07:09:47Z&st=2023-05-10T22:09:47Z&spr=https,http&sig=hoZeG0RVtXt4LWRbQWUdv4tf0MkzwSaIBMB9fLQdccA%3Dsp=racwdl&st=2023-05-10T22:06:25Z&se=2024-11-05T07:06:25Z&sv=2022-11-02&sr=c&sig=SvW3dueZPevT4OZPIjSFsdo8KTZGwK%2F3O%2Fcu1rNpmxc%3D"
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