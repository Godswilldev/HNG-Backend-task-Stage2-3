const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const app = express();

const port = process.env.PORT || 9922;

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
  const { name, email, phone, message } = req.body;
  const output = `
    <h3>You have a new message</h3>
        <h4>Contact Details</h4>
    <ul>
        <li>Name: ${name} </li>
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
    await transporter.sendMail({
      from: '"Nodemailer message" <smtp.mailtrap.io>', // sender address
      to: "gimmex1@gmail.com, godswill@godswill.tech, smtp.mailtrap.io", // list of receivers
      subject: "Node Message Request", // Subject line
      text: output, // plain text body
      html: output, // html body
    });

    res.render("contact", { msg: "Your message has been Sent" });
  };
  main().catch(console.error);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
