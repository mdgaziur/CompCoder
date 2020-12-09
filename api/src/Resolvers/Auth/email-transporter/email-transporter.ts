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

export async function sendResetMail(resetToken: string, receiver: string):Promise<string> {
    const mailOptions = {
        from: 'compcoder@compcoder.cc',
        to: receiver,
        subject: 'Password Recovery',
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
                                            <h3>Password Reset</h3>
                                        </td>
                                    </tr>
                                    <tr style="margin: 0;">
                                        <td align="center" style="background: rgb(19, 19, 19);padding:1rem">
                                            <p>We've received a request to reset the password of an account associated with your
                                                email.
                                                If
                                                you've requested us, please click on the following button or browse the link on
                                                a
                                                browser.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr style="margin: 0;">
                                        <td align="center" style="width:350px;background: rgb(34, 34, 34);padding:1rem">
                                            <a href="${"https://compcoder.cc/password_reset?token="+resetToken}">
                                                <button
                                                    style="background: white; color: black;border: none;padding: 1rem; font-size: 1rem; cursor: pointer;">Click
                                                    here to reset the password
                                                </button>
                                            </a>
                                            <br />
                                            or<br />
                                            Copy this link<br />
                                            <p>https://compcoder.cc/password_reset?token=${resetToken}
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