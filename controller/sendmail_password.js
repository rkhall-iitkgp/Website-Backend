const sgMail = require('@sendgrid/mail')

require('dotenv').config()


exports.sendMail = async (message) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

   
    sgMail.send(message).then((res) => {
        console.log('message sent ....')
    })
        .catch((err) => { console.log(err) })
}