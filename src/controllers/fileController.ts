import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { updateUserPicture } from './userController';

export const uploadPicture = async (req: Request, res: Response) => {
  try {
    const fileData = req.body?.file;
    
    if (!fileData) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert the base64 data to a buffer
    const fileBuffer = Buffer.from(fileData, 'base64');

    // Set the destination path (adjust as needed)
    const destinationPath = path.join('public', 'images', 'file-' + Date.now() + '.jpg');

    // Write the buffer to the file
    await fs.writeFile(destinationPath, fileBuffer);

    // Update the user's picture path in the database
    const userId = req.body.userId; // Assuming you have user information stored in the request
    const sanitizedPath = destinationPath.replace(/public\//g, '');

    if (userId) {
      await updateUserPicture(userId, sanitizedPath);
    }


    res.json({ message: 'File uploaded successfully', filePath: sanitizedPath });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};