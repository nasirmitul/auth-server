import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.mjs";
import { emailClient, emailSender } from "./mailtrap.config.mjs";

// sending verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await emailClient.send({
      from: emailSender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationToken}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log(`Email sent: ${response}`);
  } catch (error) {
    console.log(`Error sending verification email: ${error}`);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

// send Welcome Message
export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await emailClient.send({
      from: emailSender,
      to: recipient,
      template_uuid: "62b7dce3-e971-48ca-baee-8e2c827a94a4",
      template_variables: {
        company_info_name: "Nasir Mitul",
        name: name,
      },
    });

    console.log(`Welcome Email Sent Successfully - ${response}`);
  } catch (error) {
    console.log(`Error Sending Email - ${error}`);
    throw new Error(`Error Sending Email - ${error}`);
  }
};
