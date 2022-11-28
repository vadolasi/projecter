import { SES, config, Credentials } from "aws-sdk"
import { convert } from "html-to-text"
import mjml2html from "mjml"
import ejs from "ejs"
import { readFileSync } from "fs"

config.update({
  region: "sa-east-1",
  credentials: new Credentials({
    accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY!
  })
})

const ses = new SES()

const templates: {
  [key: string]: {
    subject: string
    body: string
  }
} = {
  verifyEmail: {
    subject: "Verifique seu email",
    body: readFileSync("./src/emails/confirm.mjml.ejs", "utf-8")
  }
}

export async function sendEmail(from: string, to: string, template: string, data: any) {
  const { html } = mjml2html(ejs.render(templates[template].body, data))

  return ses
    .sendEmail({
      Source: from,
      Destination: {
        ToAddresses: [to]
      },
      Message: {
        Subject: {
          Data: templates[template].subject,
          Charset: "UTF-8"
        },
        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8"
          },
          Text: {
            Data: convert(html),
            Charset: "UTF-8"
          }
        }
      }
    })
    .promise()
}
