import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
     const { fname, lname, phone, email, message } = req.body;
    
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
    
        const mailOptions = {
          from: '"Bhoomika Real Estate Website" <dilna@bhoomikarealestate.com>',
          to: "dilna@bhoomikarealestate.com",
          subject: "New Message from Bhoomika Contact Form",
          html: `
              <html>
              <head>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          line-height: 1.6;
                          background-color: #f4f4f4;
                          padding: 20px;
                      }
                      .container {
                          max-width: 600px;
                          margin: 0 auto;
                          padding: 20px;
                          border: 1px solid #ddd;
                          border-radius: 10px;
                          background-color: #fff;
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                      }
                      h2 {
                          background-color: #4CAF50;
                          color: white;
                          padding: 10px;
                          border-radius: 5px;
                          text-align: center;
                      }
                      .message {
                          margin-top: 20px;
                          padding: 15px;
                          background-color: #f9f9f9;
                          border: 1px solid #ddd;
                          border-radius: 5px;
                      }
                      p {
                          margin: 10px 0;
                      }
                      .footer {
                          margin-top: 20px;
                          font-size: 0.9em;
                          color: #555;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h2>New Message from Contact Form</h2>
                      <p>Hello,</p>
                      <p>My name is <strong>${fname} ${lname}</strong>. Below is my message:</p>
                      <div class="message">
                          <p>${message}</p>
                      </div>
                      <p><strong>Email:</strong> ${email}</p>
                      <div class="footer">
                          <p>Best regards,<br/>${fname} ${lname}</p>
                      </div>
                  </div>
              </body>
              </html>
          `,
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        res.status(200).send("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email");
      }
}