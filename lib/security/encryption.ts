import crypto from "crypto"

const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16
const SALT_LENGTH = 64

export class EncryptionService {
  private static getKey(secret: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(secret, salt, 100000, KEY_LENGTH, "sha512")
  }

  static encrypt(text: string, secret?: string): string {
    try {
      const encryptionKey = secret || process.env.ENCRYPTION_KEY
      if (!encryptionKey) {
        throw new Error("Encryption key not configured")
      }

      const salt = crypto.randomBytes(SALT_LENGTH)
      const key = this.getKey(encryptionKey, salt)
      const iv = crypto.randomBytes(IV_LENGTH)
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

      let encrypted = cipher.update(text, "utf8", "hex")
      encrypted += cipher.final("hex")

      const authTag = cipher.getAuthTag()

      const result = Buffer.concat([salt, iv, authTag, Buffer.from(encrypted, "hex")])

      return result.toString("base64")
    } catch (error) {
      console.error("Encryption error:", error)
      throw new Error("Failed to encrypt data")
    }
  }

  static decrypt(encryptedText: string, secret?: string): string {
    try {
      const encryptionKey = secret || process.env.ENCRYPTION_KEY
      if (!encryptionKey) {
        throw new Error("Encryption key not configured")
      }

      const buffer = Buffer.from(encryptedText, "base64")

      const salt = buffer.subarray(0, SALT_LENGTH)
      const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
      const authTag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH)
      const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH)

      const key = this.getKey(encryptionKey, salt)
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
      decipher.setAuthTag(authTag)

      let decrypted = decipher.update(encrypted.toString("hex"), "hex", "utf8")
      decrypted += decipher.final("utf8")

      return decrypted
    } catch (error) {
      console.error("Decryption error:", error)
      throw new Error("Failed to decrypt data")
    }
  }

  static hash(text: string): string {
    return crypto.createHash("sha256").update(text).digest("hex")
  }

  static compareHash(text: string, hash: string): boolean {
    return this.hash(text) === hash
  }

  static generateToken(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }
}
