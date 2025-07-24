export const jwtConstants = {
    secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
    expiresIn: '1d',
  };
  
  export const EMAIL_CONFIRMATION_URL = process.env.EMAIL_CONFIRMATION_URL;
  export const RESET_PASSWORD_URL= process.env.RESET_PASSWORD_URL;