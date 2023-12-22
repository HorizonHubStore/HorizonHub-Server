// userController.ts

import axios from "axios";
import multer from "multer";
import * as fs from "fs";
import * as path from "path";
import * as stream from "stream";
import User, { IUser } from "../models/userModule";
import { NextFunction, Request, Response } from "express";

async function saveUserProfilePicture(profile: {
    pictureUrl: string;
    username: string;
}): Promise<void> {
    const pictureUrl = profile.pictureUrl;
    const username = profile.username;

    // Download the image using axios
    const response = await axios({
        method: "get",
        url: pictureUrl,
        responseType: "stream",
    });

    // Create a writable stream to save the image
    const imagePath = path.join(
        process.cwd(),
        "public",
        "images",
        `${username}.jpg`
    );
    const writer = fs.createWriteStream(imagePath);

    // Pipe the image data to the writable stream
    response.data.pipe(writer);

    // Return a promise to await the completion of writing
    return new Promise<void>((resolve, reject) => {
        writer.on("finish", () => resolve());
        writer.on("error", (error) => reject(error));
    });
}

async function updateUserPicture(userId: string, newPicturePath: string) {
    try {
        // Retrieve the current user's data to get the old picture path
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            console.error("User not found");
            return;
        }

        const oldPicturePath = path.join("public", currentUser.picture);
        

        // Delete the old file from the server
        if (
            oldPicturePath &&
            !oldPicturePath.includes("default-user-profile.jpg")
        ) {
            try {
                await fs.unlink(oldPicturePath, (deleteError) => {
                    if (deleteError) {
                        console.error("Error deleting old file:", deleteError);
                    } else {
                        console.log("Old file deleted successfully");
                    }
                });
            } catch (deleteError) {
                console.error("Error deleting old file:", deleteError);
            }
        }

        // Update the user's picture path in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { picture: newPicturePath } },
            { new: true }
        );

        if (!updatedUser) {
            console.error("User not found");
        } else {
            console.log("User picture updated successfully");
        }
    } catch (error) {
        console.error("Error updating user picture in the database:", error);
    }
}
export { saveUserProfilePicture, updateUserPicture };
