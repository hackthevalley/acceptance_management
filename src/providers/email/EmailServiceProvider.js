/*---------------------------------------------
 * EmailServiceProvider.js
 * Provides email services, currently uses
 * AWS SES
 *
 * Author(s): Jun Zheng (me at jackzh dot com)
 ---------------------------------------------*/
import dotenv from "dotenv";

dotenv.load();

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_DEFAULT_REGION});
const SES = new AWS.SES({apiVersion: '2010-12-01'});

// Configurations
const SENDER_EMAIL = "no-reply@system.hackthevalley.io";

export default class EmailServiceProvider {

    static async send(to, subject, html, text) {
        const params = {
            Destination: { /* required */
                CcAddresses: [],
                ToAddresses: [to]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: html
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: text
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: SENDER_EMAIL
        };

        await SES.sendEmail(params).promise();

        return true;
    }

};
