import './setup';
import {_hackers2}           from "./_hackers2";
import Hacker               from "../models/Hacker";
import EmailServiceProvider from "../providers/email/EmailServiceProvider";
import {replaceVariable}    from "./utils";

const htmlTemplate = `
<!doctype html>
<html>
    <head>
        <style>
            body {
                padding: 20px;
                padding-top: 50px;
                font-family: sans-serif;
            }
            h1 {
                color: #111111;
            }
            p {
                color: #111111;
            }
            .main-logo {
                width: 100px;
            }
            a:link {
                color: black;
            }
            .container {
                max-width: 500px;
                margin-left: auto;
                margin-right: auto;
            }
        </style>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <div class="container">
        <img src="https://i.imgur.com/u0njJPq.png" alt="logo" class="main-logo"/>
        <h1>HTV III Acceptance</h1>
            <p>Hi, FULLNAME!</p>
        <p>
            🎉 Congratulations, after reviewing our Round 2 Applications, you have been accepted to attend <b>Hack the Valley III on February 22-24, 2019 at the University of Toronto Scarborough!</b>
        </p>
        <p>
            <b>❗Please visit <a href="ACCEPTANCE_LINK">here</a> to confirm or decline your spot at the hackathon!
                You must accept this invitation within 5 days.</b>
        </p>

        <p>
            For hackers coming from The University of Waterloo, we are sending a bus to your campus! You can purchase your tickets at: <a href="https://bit.ly/2MWSbta">https://bit.ly/2MWSbta</a>. All details about the bus routes, and timings are in the link! We will not be providing any travel reimbursements this year.
        </p>

        <p>
            Registration for the hackathon will start at 6:00 PM on Friday, February 22nd. ⌛ If you are coming late to the hackathon after 9:00 PM, please let us know at hello@hackthevalley.io. ⌛  Further information will follow once you accept your invitation.
        </p>

    <p>We are looking forward to having you at Hack the Valley III!</p>
    <p>Hack the Valley Team</p>
            </div>
    </body>
</html>
`;

const textTemplate = `HTV III Acceptance

Hi, FULLNAME!

🎉 Congratulations, after reviewing our Round 2 Applications, you have been accepted to attend Hack the Valley III on February 22-24, 2019 at the University of Toronto Scarborough!

❗Please visit ACCEPTANCE_LINK to confirm or decline your spot at the hackathon!
You must accept this invitation within 5 days.

For hackers coming from The University of Waterloo, we are sending a bus to your campus! You can purchase your tickets at: https://bit.ly/2MWSbta. All details about the bus routes, and timings are in the link! We will not be providing any travel reimbursements this year.

Registration for the hackathon will start at 6:00 PM on Friday, February 22nd. ⌛ If you are coming late to the hackathon after 9:00 PM, please let us know at hello@hackthevalley.io. ⌛  Further information will follow once you accept your invitation.

We are looking forward to having you at Hack the Valley III!
Hack the Valley Team`;

async function sendToHacker(email) {
    let hacker = await Hacker.findOne({email_address: email});
    if(hacker) {
        let fullName = `${hacker.first_name} ${hacker.last_name}`;
        let code = hacker.acceptance_code;
        let html = replaceVariable(htmlTemplate, 'ACCEPTANCE_LINK', `https://acceptance.hackthevalley.io/offers?code=${code}`);
        html = replaceVariable(html, 'FULLNAME', fullName);
        let text = replaceVariable(textTemplate, 'ACCEPTANCE_LINK', `https://acceptance.hackthevalley.io/offers?code=${code}`);
        text = replaceVariable(text, 'FULLNAME', fullName);
        await EmailServiceProvider.send(email, "HTV III Acceptance", html, text);
        console.log("Email sent...", email);
    }
}

(async () => {
    for(let email of _hackers2) {
        await sendToHacker(email);
    }
})();
