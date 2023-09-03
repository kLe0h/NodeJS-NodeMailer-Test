const { Router } = require('express')
const nodemailer = require('nodemailer')
const { google } = require('googleapis') 
const router = Router();
require("dotenv").config();

//defining .env variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

router.post('/send_email', async (req, res) => {
    const {name, email, message} = req.body; 
    
    contentHTML = `
        <h1>User information</h1>
        <ul>
            <li> Username: ${name} </l1>
            <li> Email: ${email} </l1>
        </ul>
        <p>
        Message: ${message} 
        </p>
    `

    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    )
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

    async function sendMail(){
        try {
            const ACCESS_TOKEN = await oAuth2Client.getAccessToken()
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "Oauth2",
                    user: "elmastrollxd34@gmail.com",
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: ACCESS_TOKEN
                }
            })
            const mailOptions = {
                from: "Envio pagina web Nodemailer <elmastrollxd34@gmail.com>",
                to: email,
                subject: "Nodemailer prueba",
                html: contentHTML
            }
            const result = await transporter.sendMail(mailOptions);
            return result;
            
        } catch (error) {
            console.log(error)
        }
    } 

    sendMail()
        .then((result) => res.status(200).send("enviado"))
        .catch( (error) => console.log(error.message));

    res.redirect('/sucess.html')
})

module.exports = router;