
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const senderEmail = process.env.SENDER_EMAIL
const recipientEmail = process.env.RECIPIENT_EMAIL

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function submitForm(req, res) {
  if(req.method === 'POST') {
    try {
      const payload = {
        to: recipientEmail,
        from: senderEmail,
        subject: "JohnTrainum.com got an message!",
        text: `
          HEY JOHN. This is Jamie's automated email system. You got an email on your website. Here is the information:

          NAME: ${req.body.name}
          EMAIL: ${req.body.email}
          COMMENTS: ${req.body.comments}
        `
      }
      let r = await sgMail.send(payload)
      res.send({msg: 'ok'})
    } catch (err) {
      console.log('\n\n ERROR: \n ', err)
      res.status(500).send({msg: 'not ok', error: err})
    }
  } else {
    res.status(400).send({msg: 'Bad request.'})
  }
}