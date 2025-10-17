import { google } from "googleapis"

const SCOPES = ["https://www.googleapis.com/auth/drive.file"]

interface GoogleDriveConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
}

export class GoogleDriveClient {
  private oauth2Client: any

  constructor(config: GoogleDriveConfig) {
    this.oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri)
  }

  getAuthUrl(state: string): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      state: state,
    })
  }

  async getToken(code: string): Promise<any> {
    const { tokens } = await this.oauth2Client.getToken(code)
    this.oauth2Client.setCredentials(tokens)
    return tokens
  }

  setCredentials(tokens: any): void {
    this.oauth2Client.setCredentials(tokens)
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folderId?: string,
  ): Promise<{ fileId: string; webViewLink: string }> {
    const drive = google.drive({ version: "v3", auth: this.oauth2Client })

    const fileMetadata: any = {
      name: fileName,
    }

    if (folderId) {
      fileMetadata.parents = [folderId]
    }

    const media = {
      mimeType: mimeType,
      body: Buffer.from(fileBuffer),
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    })

    return {
      fileId: response.data.id!,
      webViewLink: response.data.webViewLink!,
    }
  }

  async createFolder(folderName: string, parentFolderId?: string): Promise<string> {
    const drive = google.drive({ version: "v3", auth: this.oauth2Client })

    const fileMetadata: any = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    }

    if (parentFolderId) {
      fileMetadata.parents = [parentFolderId]
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id",
    })

    return response.data.id!
  }

  async listFiles(folderId?: string): Promise<any[]> {
    const drive = google.drive({ version: "v3", auth: this.oauth2Client })

    const query = folderId ? `'${folderId}' in parents and trashed=false` : "trashed=false"

    const response = await drive.files.list({
      q: query,
      fields: "files(id, name, mimeType, createdTime, webViewLink)",
      orderBy: "createdTime desc",
    })

    return response.data.files || []
  }

  async deleteFile(fileId: string): Promise<void> {
    const drive = google.drive({ version: "v3", auth: this.oauth2Client })
    await drive.files.delete({ fileId: fileId })
  }

  async downloadFile(fileId: string): Promise<Buffer> {
    const drive = google.drive({ version: "v3", auth: this.oauth2Client })

    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "arraybuffer" },
    )

    return Buffer.from(response.data as ArrayBuffer)
  }
}

export function createGoogleDriveClient(): GoogleDriveClient {
  if (!process.env.GOOGLE_DRIVE_CLIENT_ID || !process.env.GOOGLE_DRIVE_CLIENT_SECRET) {
    throw new Error("Google Drive credentials not configured")
  }

  return new GoogleDriveClient({
    clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
    redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/integrations/google-drive/callback`,
  })
}
