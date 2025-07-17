import { SESClient, SendEmailCommand, SendRawEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client - AWS SDK will automatically use environment variables
const sesClient = new SESClient({ 
  region: process.env.AWS_REGION || 'us-east-1' 
});

export interface EmailOptions {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    content: string;
    filename: string;
    type: string;
    disposition: 'attachment';
  }>;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.");
    }

    // For emails with attachments, use SendRawEmailCommand
    if (options.attachments && options.attachments.length > 0) {
      const rawEmail = createRawEmail(options);
      const command = new SendRawEmailCommand({
        RawMessage: {
          Data: Buffer.from(rawEmail)
        }
      });
      
      await sesClient.send(command);
    } else {
      // For simple emails without attachments, use SendEmailCommand
      const command = new SendEmailCommand({
        Source: options.from,
        Destination: {
          ToAddresses: [options.to]
        },
        Message: {
          Subject: {
            Data: options.subject,
            Charset: 'UTF-8'
          },
          Body: {
            ...(options.text && {
              Text: {
                Data: options.text,
                Charset: 'UTF-8'
              }
            }),
            ...(options.html && {
              Html: {
                Data: options.html,
                Charset: 'UTF-8'
              }
            })
          }
        }
      });

      await sesClient.send(command);
    }

    return true;
  } catch (error) {
    console.error('SES email error:', error);
    return false;
  }
}

function createRawEmail(options: EmailOptions): string {
  const boundary = `----=_Part_${Date.now()}`;
  
  let rawEmail = [
    `From: ${options.from}`,
    `To: ${options.to}`,
    `Subject: ${options.subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    `Content-Type: multipart/alternative; boundary="${boundary}_alt"`,
    '',
    `--${boundary}_alt`,
    `Content-Type: text/plain; charset=UTF-8`,
    '',
    options.text || '',
    ''
  ];

  if (options.html) {
    rawEmail.push(
      `--${boundary}_alt`,
      `Content-Type: text/html; charset=UTF-8`,
      '',
      options.html,
      ''
    );
  }

  rawEmail.push(`--${boundary}_alt--`);

  // Add attachments
  if (options.attachments) {
    for (const attachment of options.attachments) {
      rawEmail.push(
        '',
        `--${boundary}`,
        `Content-Type: ${attachment.type}`,
        `Content-Disposition: attachment; filename="${attachment.filename}"`,
        `Content-Transfer-Encoding: base64`,
        '',
        attachment.content,
        ''
      );
    }
  }

  rawEmail.push(`--${boundary}--`);
  
  return rawEmail.join('\r\n');
}

export default { sendEmail };