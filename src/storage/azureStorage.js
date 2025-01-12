import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = "DefaultEndpointsProtocol=https;AccountName=azureblobb111;AccountKey=O7zBUJ0VKbggWFZgf56J/2cEZWJy3ujWqFS9D6NDpTriG8lEaKOtKNjJGdMzxFAf/kDRd05AMUPu+ASt17Fw1g==;EndpointSuffix=core.windows.net";
const containerName = "tiktok-uploads";

// Initialize BlobServiceClient
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadToAzureBlob = async (file) => {
  try {
    const blobName = `uploads/${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload file
    await blockBlobClient.uploadBrowserData(file, {
      blobHTTPHeaders: { blobContentType: file.type },
    });

    return { name: file.name, url: blockBlobClient.url };
  } catch (error) {
    throw new Error(`Azure Blob Upload Error: ${error.message}`);
  }
};

export const listAzureBlobs = async () => {
  try {
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push({ name: blob.name, url: `${containerClient.url}/${blob.name}` });
    }
    return blobs;
  } catch (error) {
    throw new Error(`Azure Blob List Error: ${error.message}`);
  }
};
