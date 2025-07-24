export const ResetEmailTemplate = (url: string) => `
  <h2>Email Confirmation</h2>
  <p>Please click the link to Reset your password:</p>
  <a href="${url}">${url}</a>
`;
