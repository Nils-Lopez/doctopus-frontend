import { BlobServiceClient } from "@azure/storage-blob";

/**
 *
 * @param {file} file
 * @param {string} containerName
 *
 * @returns {string} fileString
 */

async function fileUpload(file, containerName) {
  try {
    let storageAccount = "imagesdoctopus";
    let sasToken = "?sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2029-01-08T22:14:20Z&st=2026-01-08T13:59:20Z&spr=https&sig=TAXLxRuWwWy%2FmjJu4SNvAetwYsWrjhn0pQ2AiFSPAwU%3D";

    const blobService = new BlobServiceClient(
      `https://${storageAccount}.blob.core.windows.net/${sasToken}`
    );

    const containerClient = blobService.getContainerClient(containerName);

    const blobClient = containerClient.getBlockBlobClient(file[0].file.name);

    const options = {
      blobHTTPHeaders: {
        blobContentType: file[0].file.type,
      },
    };

    const res = await blobClient.uploadBrowserData(file[0].file, options);

    if (res) {
      const fileString = `https://${storageAccount}.blob.core.windows.net/${containerName}/${file[0].file.name}`;
      return fileString;
    }
  } catch (error) {
    throw Error("Error uploading file to Azure");
  }
}

export { fileUpload };
