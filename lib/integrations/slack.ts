import { WebClient } from "@slack/web-api"

export interface SlackConfig {
  token: string
}

export class SlackClient {
  private client: WebClient

  constructor(config: SlackConfig) {
    this.client = new WebClient(config.token)
  }

  async sendMessage(channel: string, text: string, blocks?: any[]): Promise<any> {
    const response = await this.client.chat.postMessage({
      channel: channel,
      text: text,
      blocks: blocks,
    })

    return response
  }

  async sendNotification(channel: string, title: string, message: string, fields?: any[]): Promise<any> {
    const blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: title,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message,
        },
      },
    ]

    if (fields && fields.length > 0) {
      blocks.push({
        type: "section",
        fields: fields.map((field) => ({
          type: "mrkdwn",
          text: `*${field.title}*\n${field.value}`,
        })),
      })
    }

    return this.sendMessage(channel, message, blocks)
  }

  async uploadFile(
    channels: string[],
    file: Buffer,
    filename: string,
    title?: string,
    initialComment?: string,
  ): Promise<any> {
    const response = await this.client.files.uploadV2({
      channels: channels.join(","),
      file: file,
      filename: filename,
      title: title,
      initial_comment: initialComment,
    })

    return response
  }

  async listChannels(): Promise<any[]> {
    const response = await this.client.conversations.list({
      types: "public_channel,private_channel",
    })

    return response.channels || []
  }

  async getUserInfo(userId: string): Promise<any> {
    const response = await this.client.users.info({
      user: userId,
    })

    return response.user
  }
}

export function createSlackClient(token?: string): SlackClient {
  const slackToken = token || process.env.SLACK_BOT_TOKEN

  if (!slackToken) {
    throw new Error("Slack token not configured")
  }

  return new SlackClient({ token: slackToken })
}
