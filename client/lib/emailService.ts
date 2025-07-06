// Email notification service for user registration and login
// In production, this would integrate with services like SendGrid, Mailgun, etc.

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  provider: "email" | "google" | "facebook";
  isNewUser: boolean;
}

export class EmailService {
  // Simulate email sending delay
  private static async simulateEmailDelay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Generate welcome email template
  private static generateWelcomeEmail(data: WelcomeEmailData): EmailTemplate {
    const { userName, userEmail, provider, isNewUser } = data;

    const providerName =
      provider === "google"
        ? "Google"
        : provider === "facebook"
          ? "Facebook"
          : "email";

    const actionText = isNewUser ? "signing up" : "logging in";
    const welcomeText = isNewUser ? "Welcome to" : "Welcome back to";

    const subject = `${welcomeText} Dubai Visa Directory - Thank You for ${actionText}!`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0070f0, #f3bd35); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .gold { color: #f3bd35; }
            .button { display: inline-block; background: #0070f0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .provider-badge { background: ${provider === "google" ? "#4285F4" : provider === "facebook" ? "#1877F2" : "#666"}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Dubai<span class="gold">Visa</span>Directory</div>
              <h2>${welcomeText} Dubai's Premier Immigration Directory!</h2>
            </div>
            <div class="content">
              <h3>Hello ${userName}! 👋</h3>
              
              <p>Thank you for ${actionText} with Dubai Visa Directory via <span class="provider-badge">${providerName}</span>!</p>
              
              ${
                isNewUser
                  ? `
                <p>🎉 <strong>Welcome to our community!</strong> You now have access to:</p>
                <ul>
                  <li>✅ Browse verified immigration and visa services</li>
                  <li>✅ Read authentic customer reviews</li>
                  <li>✅ Write reviews for businesses you've used</li>
                  <li>✅ Get personalized recommendations</li>
                  <li>✅ Direct contact with service providers</li>
                </ul>
              `
                  : `
                <p>🔄 <strong>Welcome back!</strong> Continue exploring our trusted network of immigration professionals.</p>
              `
              }
              
              <p>With over 150+ verified businesses and 2,500+ authentic reviews, we're here to help you find the right immigration services in Dubai.</p>
              
              <div style="text-align: center;">
                <a href="https://dubaiintegral.example.com" class="button">Start Exploring Services</a>
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background: white; border-left: 4px solid #0070f0; border-radius: 4px;">
                <h4>🛡️ Your Privacy & Security</h4>
                <p>Your account is secured via ${providerName} authentication. We never store your social login passwords and only access basic profile information with your consent.</p>
              </div>
              
              <div style="margin-top: 20px;">
                <h4>📞 Need Help?</h4>
                <p>Our support team is here to assist you:</p>
                <ul>
                  <li>📧 Email: support@dubaiintegral.example.com</li>
                  <li>📱 WhatsApp: +971-50-XXX-XXXX</li>
                  <li>🕒 Business Hours: 9 AM - 6 PM GST</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>Dubai Visa Directory - Your Trusted Immigration Partner</p>
              <p>This email was sent to ${userEmail} because you ${actionText} on our platform.</p>
              <p><a href="#" style="color: #666;">Unsubscribe</a> | <a href="#" style="color: #666;">Privacy Policy</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
${welcomeText} Dubai Visa Directory!

Hello ${userName}!

Thank you for ${actionText} with Dubai Visa Directory via ${providerName}!

${
  isNewUser
    ? `
🎉 Welcome to our community! You now have access to:
- Browse verified immigration and visa services
- Read authentic customer reviews  
- Write reviews for businesses you've used
- Get personalized recommendations
- Direct contact with service providers
`
    : `
🔄 Welcome back! Continue exploring our trusted network of immigration professionals.
`
}

With over 150+ verified businesses and 2,500+ authentic reviews, we're here to help you find the right immigration services in Dubai.

🛡️ Your Privacy & Security
Your account is secured via ${providerName} authentication. We never store your social login passwords and only access basic profile information with your consent.

📞 Need Help?
- Email: support@dubaiintegral.example.com
- WhatsApp: +971-50-XXX-XXXX  
- Business Hours: 9 AM - 6 PM GST

Visit: https://dubaiintegral.example.com

Dubai Visa Directory - Your Trusted Immigration Partner
This email was sent to ${userEmail} because you ${actionText} on our platform.
    `;

    return { subject, htmlContent, textContent };
  }

  // Send welcome email
  public static async sendWelcomeEmail(
    data: WelcomeEmailData,
  ): Promise<boolean> {
    try {
      console.log("📧 Sending welcome email...", data);

      // Generate email template
      const emailTemplate = this.generateWelcomeEmail(data);

      // Simulate email sending
      await this.simulateEmailDelay();

      // In production, this would call your email service API:
      // await sendGridClient.send({
      //   to: data.userEmail,
      //   from: 'noreply@dubaiintegral.example.com',
      //   subject: emailTemplate.subject,
      //   html: emailTemplate.htmlContent,
      //   text: emailTemplate.textContent
      // });

      // Log the email content for demo purposes
      console.log("📧 EMAIL SENT SUCCESSFULLY!");
      console.log("To:", data.userEmail);
      console.log("Subject:", emailTemplate.subject);
      console.log(
        "Content Preview:",
        emailTemplate.textContent.substring(0, 200) + "...",
      );

      return true;
    } catch (error) {
      console.error("❌ Failed to send welcome email:", error);
      return false;
    }
  }

  // Send review notification email (bonus feature)
  public static async sendReviewNotificationEmail(
    businessEmail: string,
    reviewerName: string,
    businessName: string,
    rating: number,
  ): Promise<boolean> {
    try {
      console.log("📧 Sending review notification email...");

      await this.simulateEmailDelay();

      console.log(`📧 Review notification sent to ${businessEmail}`);
      console.log(
        `New ${rating}⭐ review from ${reviewerName} for ${businessName}`,
      );

      return true;
    } catch (error) {
      console.error("❌ Failed to send review notification:", error);
      return false;
    }
  }
}
