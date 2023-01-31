export type EmailContact = {
  name: string;
  address: string;
};

export type EmailBody = {
  file: string;
  variables: { [key: string]: string | number };
};

export type EmailType = {
  to: EmailContact[];
  from: EmailContact;
  subject: string;
  body: EmailBody;
};

interface IEmailProvider {
  sendMail(emailData: EmailType): Promise<void>;
}

export { IEmailProvider };
