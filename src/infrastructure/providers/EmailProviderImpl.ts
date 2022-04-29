import { EmailProvider } from 'src/domain/providers/EmailProvider';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { Options } from 'nodemailer/lib/mailer';
import { createTransport, Transporter } from 'nodemailer';

export class EmailProviderImpl implements EmailProvider {
  public send(email: string, subject: string, message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transporter: Transporter<SentMessageInfo> = createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const options: Options = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject,
        text: message,
      };

      transporter.sendMail(options, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}
