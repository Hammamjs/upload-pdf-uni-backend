import { google } from 'googleapis';
import { createReadStream, existsSync } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const googleAuth = () => {
  const oauth2client = new google.auth.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  const drive = google.drive({
    version: 'v3',
    auth: oauth2client,
  });
  if (process.env.REFRESH_TOKEN) {
    oauth2client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  }
  return drive;
};

export const uploadFileToDrive = async (filename) => {
  const drive = googleAuth();
  // read file befoe upload it
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = path.resolve(__dirname, '..', 'uploads', filename);

  console.log(filePath);

  if (!existsSync(filePath)) {
    throw new Error(`❌ File does not exist: ${filePath}`);
  }

  console.log(createReadStream(filePath));

  const response = await drive.files.create({
    requestBody: {
      name: filename,
      mimeType: 'application/pdf',
    },
    media: {
      mimeType: 'application/pdf',
      body: createReadStream(filePath),
    },
  });
  return response.data.id;
};

export const generatePublicUrl = async (id) => {
  const drive = googleAuth();
  await drive.permissions.create({
    fileId: id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const result = await drive.files.get({
    fileId: id,
    fields: 'webViewLink, webContentLink',
  });

  return result.data;
};

export const deletePDF = async (id) => {
  const drive = googleAuth();
  await drive.files.delete({
    fileId: id,
  });
};
