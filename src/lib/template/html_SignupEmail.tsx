

export const generateSignupEmail = (signupLink: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
          <h2 style="color: #333;">You're Invited to Join Our Platform 🎉</h2>
          
          <p style="font-size: 15px; color: #555;">
            Click the button below to complete your signup and access your dashboard.
          </p>
          
          <a href="${signupLink}" 
             style="display: inline-block; margin-top: 15px; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Complete Your Signup
          </a>
          
            <p style="font-size: 13px; color: #888; text-align: center;">
            This link will expire when you complete your signup for your security.
          </p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            If you didn’t expect this invitation, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
};
