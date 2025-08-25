const nodemail=require("nodemailer")
const {sender_email,pass_email}=require("../config/keys")

const sendEmail=async({emailTo,subject,code,content})=>{
    const transporter = nodemail.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: sender_email,
        pass: pass_email,
      },
    });
    const message = {
      from: `"My App" <bilisumaere@gmail.com>`,
      to: emailTo,
      subject,
      html: `
        <div>
            <h3>use below code to ${content}code</h3>
            <p><strong>Code:</strong>${code}</p>
        </div>
        `,
    };
    await transporter.sendMail(message)
    
}
module.exports=sendEmail