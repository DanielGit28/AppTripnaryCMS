import sgMail from "@sendgrid/mail";

export const sendEmail = async (email, name, password) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "lgaleanoh@ucenfotec.ac.cr",
    templateId: "d-c6ea1222449944f8b2f8d5149b665a83",
    dynamic_template_data: {
      name: name,
      email: email,
      password: password,
    },
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    if (error.response && error.response.body) {
      console.error(error.response.body.errors);
    } else {
      console.error(error);
    }
  }
};

export const sendEmailInvitacion = async (email, name) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log(email, name);
  const msg = {
    to: email,
    from: "lgaleanoh@ucenfotec.ac.cr",
    templateId: "d-a286d171084a4d9d9b3fc86035b2eebe",
    dynamic_template_data: {
      name: name,
      email: email,
    },
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    if (error.response && error.response.body) {
      console.error(error.response.body.errors);
    } else {
      console.error(error);
    }
  }
};
