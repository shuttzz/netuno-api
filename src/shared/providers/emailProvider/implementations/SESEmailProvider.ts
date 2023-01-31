import { EmailType, IEmailProvider } from '../IEmailProvider';
import * as nodemailer from 'nodemailer';
import { SES } from 'aws-sdk';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

export class SESEmailProvider implements IEmailProvider {
  private client: nodemailer.Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_REGION_SES,
      }),
    });
  }
  async sendMail({ from, subject, to, body }: EmailType): Promise<void> {
    const templateFileContent = await fs.promises.readFile(body.file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    const info = await this.client.sendMail({
      from: {
        name: 'Netuno Mini Gerenciador Financeiro',
        address: process.env.AWS_MAIL_FROM,
      },
      to,
      subject,
      html: parseTemplate(body.variables),
    });

    return Promise.resolve(undefined);
  }
}
