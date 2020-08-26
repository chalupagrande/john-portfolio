
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
        subject: "You've got a message!",
        text: JSON.stringify(req.body)
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