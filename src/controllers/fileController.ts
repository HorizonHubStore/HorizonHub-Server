import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { updateUserPicture } from './userController';

// Function to handle generic file uploads
const handleFileUpload = async (
  fileData: string,
  destinationFolder: string,
  fileExtension: string
): Promise<string> => {
  try {
    // Check if the destination folder exists, create it if not
    await fs.mkdir(destinationFolder, { recursive: true });

    // Convert the base64 data to a buffer
    const fileBuffer = Buffer.from(fileData, 'base64');

    // Set the destination path
    const destinationPath = path.join(destinationFolder, `file-${Date.now()}.${fileExtension}`);

    // Write the buffer to the file
    await fs.writeFile(destinationPath, fileBuffer);

    // Remove the "public/" prefix from the file path
    const sanitizedPath = destinationPath.replace(/public\//g, '');
    console.log(sanitizedPath);
    
    return sanitizedPath;
  } catch (error) {
    throw new Error(`Error handling file upload: ${error}`);
  }
};

export const uploadPicture = async (req: Request, res: Response) => {
  try {
    const fileData = req.body?.file;
    

    if (!fileData) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.body.userId; // Assuming you have user information stored in the request

    // Use the handleFileUpload function for generic file uploads
    const sanitizedPath = await handleFileUpload(fileData, 'public/images', 'jpg');
    console.log(sanitizedPath);
    

    // Update the user's picture path in the database
    if (userId) {
      await updateUserPicture(userId, sanitizedPath);
    }

    res.json({ message: 'File uploaded successfully', filePath: sanitizedPath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
