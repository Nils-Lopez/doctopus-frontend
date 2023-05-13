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
    let sasToken = "https://imagesdoctopus.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2023-05-13T04:55:22Z&st=2023-05-12T20:55:22Z&spr=https&sig=X5pZAyrZQgt10f9uCBzRyZ9K4WibCIWpJE6zOjHeWDw%3D";

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
