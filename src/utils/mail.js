import Mailgen from "mailgen";
const emailVerficationMailGenerator = (username, verficationurl) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to Project Camp! We're very excited to have you on board.",
      action: {
        instructions: "To get started with Project Camp, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify your email",
          link: verficationurl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
const forgotPasswordMailGenerator = (username, resetPasswordUrl) => {
  return {
    body: {
      name: username,
      intro:
        "You have requested to reset your password. Please click the button below to reset your password.",
      action: {
        instructions: "To reset your password, please click here:",
        button: {
          color: "#bc3422", // Optional action button color
          text: "Reset your password",
          link: resetPasswordUrl,
        },
      },
      outro:
        "If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 10 minutes.",
    },
  };
};
export { emailVerficationMailGenerator, forgotPasswordMailGenerator };
