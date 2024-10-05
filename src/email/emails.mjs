import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate.mjs";
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

// send Welcome Message after verifying account
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

// send reset password email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  const recipient = [{ email }];
  try {
    const response = await emailClient.send({
      from: emailSender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password Reset",
    });
  } catch (error) {
    console.log(`Error sending password reset email: ${error}`);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

// send password reset success message
export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];

  try {
    const response = await emailClient.send({
      from: emailSender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    });

    console.log(`Password reset email sent successful ${response}`);
  } catch (error) {
    console.log(`Error sending password reset email ${error}`);
    throw new Error(`Error sending password reset email ${error}`);
  }
};
