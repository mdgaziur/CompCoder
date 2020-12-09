import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

async function sendMailWrapper(mailOptions:Object):Promise<Boolean> {
    return new Promise((res) => {
        let transporter: Mail = createTransport({
            service: 'gmail',
            auth: {
                user: process.env.CB_EMAIL,
                pass: process.env.CB_EMAIL_PASSWORD
            }
        });

        transporter.sendMail(mailOptions, (err) => {
            if(err) {
                console.log(err);
                res(false);
            } else {
                res(true);
            }
        });
    })
}

export async function sendEmailChangeMail(token: string, newEmailAddress: string, receiver: string):Promise<string> {
    const mailOptions = {
        from: 'compcoder@compcoder.cc',
        to: receiver,
        subject: 'Change Email Address',
        html: `
        <!Doctype html>

<body style="height: 100%;">
    <center style="height: 100%">
        <table style="height: 100%">
            <tbody>
                <tr>
                    <td>
                        <table width="350px" valign="center"
                            style="background: rgb(49, 49, 49); color: white;padding:1rem;">
                            <tr style="margin: 0;">
                                <td align="center" style="background: rgb(34, 34, 34);padding:1rem">
                                    <h1>compcoder</h1>
                                    <h3>Email Change Confirmation</h3>
                                </td>
                            </tr>
                            <tr style="margin: 0;">
                                <td align="center" style="background: rgb(19, 19, 19);padding:1rem">
                                    <p>
                                        We've received a request to change your email address to ${newEmailAddress}. If you haven't made that request, that means your account have been compromised. Immediately
                                        change your password. If you can't login, reset your password. Contact us for further help.
                                    </p>
                                </td>
                            </tr>
                            <tr style="margin: 0;">
                                <td align="center" style="width:350px;background: rgb(34, 34, 34);padding:1rem">
                                    <a href="https://compcoder.cc/change_email?token=${token}">
                                        <button
                                            style="background: white; color: black;border: none;padding: 1rem; font-size: 1rem; cursor: pointer;">
                                            Click here to change email
                                        </button>
                                    </a>
                                    <br />
                                    or<br />
                                    Copy this link<br />
                                    <p>https://compcoder.cc/change_email?token=${token}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>

</html>`
    }

    let mailStatus = await sendMailWrapper(mailOptions);
    if(mailStatus) {
        return 'SUCCESS';
    } else {
        return 'FAILED';
    }
}