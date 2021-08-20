const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();

// View engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// static folder
app.use("/public", express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => res.render("contact"));

app.post("/send", (req, res) => {
  const { name, email, phone, company, message } = req.body;
  const output = `
    <h3>You have a new message</h3>
        <h4>Contact Details</h4>
    <ul>
        <li>Name: ${name} </li>
        <li>Company: ${company} </li>
        <li>Email: ${email} </li>
        <li>Phone: ${phone} </li>    
    </ul>
    <h3>Message</h3>
        <p> ${message} </p>
`;

  // nodemailer configurations

  const main = async () => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "90bf6be245dc9e", // generated ethereal user
        pass: "3a6bf36d99a704", // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Nodemailer message" <smtp.mailtrap.io>', // sender address
      to: "gimmex1@gmail.com, godswill@godswill.tech, smtp.mailtrap.io", // list of receivers
      subject: "Node Message Request", // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("contact", { msg: "Your message has been Sent" });
  };
  main().catch(console.error);
});

app.listen(3000, () => console.log(`Server started on port 3000`));