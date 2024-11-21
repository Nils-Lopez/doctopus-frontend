import { BlobServiceClient} from '@azure/storage-blob';

const containerName = `contredanse`; // Fill string with your container name
const storageAccountName = "imagesdoctopus"; // Fill string with your Storage resource name
// const sasToken = "?sv=2022-11-02&ss=bfqt&srt=sc&sp=rwdlacupiytfx&se=2023-05-14T18:45:28Z&st=2023-05-14T10:45:28Z&spr=https,http&sig=lha3C5lqZRV44reJz0RZVZcnGmTiCgBxvirMEnZorfo%3D";
const sasToken = "sv=2022-11-02&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2025-11-22T04:56:47Z&st=2024-11-21T20:56:47Z&spr=https&sig=HzqsAd5axmOTiTPiC2E68QhypdkpEn4gn%2Fw6TW0MRWE%3D"
// Feature flag - disable storage feature to app if not configured
export const isStorageConfigured = () => {
  return !((!storageAccountName || !sasToken));
};

// return list of blobs in container to display
export const getBlobsInContainer = async (containerClient) => {
  const returnedBlobUrls = [];



  // get list of blobs in container
  // eslint-disable-next-line
  for await (const blob of containerClient.listBlobsFlat()) {
    // if image is public, just construct URL
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
};


async function deleteBlobIfItExists(containerClient, blobName){

  // include: Delete the base blob and all of its snapshots.
  // only: Delete only the blob's snapshots and not the blob itself.
  const options = {
    deleteSnapshots: 'include' // or 'only'
  }

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.deleteIfExists(options);

  return console.log(`deleted blob ${blobName}`);

}

const createBlobInContainer = async (containerClient, file) => {
  
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);



  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadBrowserData(file, options);
  await blobClient.setMetadata({UserName : 'shubham'});
  };

const uploadFileToBlob = async (file, remove) => {
  if (!file) return [];
    // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );
  // get Container - full public read access
  const containerClient = blobService.getContainerClient(containerName);

  if (remove) {
    await deleteBlobIfItExists(containerClient, file)
    return true
  } else {
      // upload file
      await createBlobInContainer(containerClient, file);
      // get list of blobs in container
      const listBlobs = await getBlobsInContainer(containerClient)
      return listBlobs
  }

};
// </snippet_uploadFileToBlob>

export default uploadFileToBlob;