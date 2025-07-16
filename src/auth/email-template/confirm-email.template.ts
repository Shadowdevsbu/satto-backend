export const confirmationTemplate = (url: string) => `
  <h2>Email Confirmation</h2>
  <p>Please click the link to confirm your email:</p>
  <a href="${url}">${url}</a>
`;
