import EmailTemplate from '../models/emailTemplate.model';

const defaultTemplates = [
    {
        name: 'welcome',
        subject: 'Welcome to CS2 Boost - Your account is ready!',
        variables: ['username', 'password'],
        description: 'Sent to users who register via Google OAuth',
        html_content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;padding:20px 0 48px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <!-- Logo -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:24px 24px 16px">
                        <tbody>
                            <tr>
                                <td>
                                    <img alt="CS2 Boost" height="40" src="https://res.cloudinary.com/du93troxt/image/upload/v1734800686/logo_j0xyfu.png" style="display:block;outline:none;border:none;text-decoration:none" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Main Card -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#18181b;border-radius:12px;border:1px solid #27272a;padding:40px 32px">
                        <tbody>
                            <tr>
                                <td>
                                    <h1 style="color:#fafafa;font-size:28px;font-weight:700;margin:0 0 8px;padding:0">Welcome aboard! 🎮</h1>
                                    <p style="color:#a1a1aa;font-size:16px;line-height:24px;margin:0 0 24px">Your CS2 Boost account has been created successfully.</p>
                                    
                                    <!-- Credentials Box -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#27272a;border-radius:8px;padding:20px;margin:24px 0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p style="color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px">Your Login Credentials</p>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:8px 0;border-bottom:1px solid #3f3f46">
                                                                <span style="color:#71717a;font-size:14px">Username</span>
                                                            </td>
                                                            <td style="padding:8px 0;border-bottom:1px solid #3f3f46;text-align:right">
                                                                <span style="color:#fafafa;font-size:14px;font-weight:600">{{username}}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:8px 0">
                                                                <span style="color:#71717a;font-size:14px">Password</span>
                                                            </td>
                                                            <td style="padding:8px 0;text-align:right">
                                                                <code style="background-color:#3f3f46;color:#22c55e;padding:4px 8px;border-radius:4px;font-size:14px;font-family:monospace">{{password}}</code>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- CTA Button -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:32px 0">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <a href="http://localhost:3000/login" style="background:linear-gradient(135deg,#3b82f6 0%,#8b5cf6 100%);color:#fff;font-size:14px;font-weight:600;text-decoration:none;text-align:center;display:inline-block;padding:12px 32px;border-radius:8px">
                                                        Login to Your Account →
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Security Note -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#422006;border:1px solid #854d0e;border-radius:8px;padding:16px;margin-top:24px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p style="color:#fbbf24;font-size:14px;line-height:20px;margin:0">
                                                        <strong>🔐 Security Tip:</strong> Please change your password after your first login.
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 24px">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <p style="color:#52525b;font-size:12px;line-height:20px;margin:0">
                                        © 2024 CS2 Boost. All rights reserved.<br/>
                                        <a href="#" style="color:#3b82f6;text-decoration:underline">Unsubscribe</a> · <a href="#" style="color:#3b82f6;text-decoration:underline">Privacy Policy</a>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`,
    },
    {
        name: 'forgot_password',
        subject: 'Reset Your Password - CS2 Boost',
        variables: ['username', 'otp'],
        description: 'Sent when user requests password reset',
        html_content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;padding:20px 0 48px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <!-- Logo -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:24px 24px 16px">
                        <tbody>
                            <tr>
                                <td>
                                    <img alt="CS2 Boost" height="40" src="https://res.cloudinary.com/du93troxt/image/upload/v1734800686/logo_j0xyfu.png" style="display:block;outline:none;border:none;text-decoration:none" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Main Card -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#18181b;border-radius:12px;border:1px solid #27272a;padding:40px 32px">
                        <tbody>
                            <tr>
                                <td>
                                    <h1 style="color:#fafafa;font-size:28px;font-weight:700;margin:0 0 8px;padding:0">Reset your password 🔑</h1>
                                    <p style="color:#a1a1aa;font-size:16px;line-height:24px;margin:0 0 8px">Hey <strong style="color:#fafafa">{{username}}</strong>,</p>
                                    <p style="color:#a1a1aa;font-size:16px;line-height:24px;margin:0 0 32px">We received a request to reset your password. Use the verification code below:</p>
                                    
                                    <!-- OTP Code -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <div style="background:linear-gradient(135deg,#ec4899 0%,#f43f5e 100%);border-radius:12px;padding:24px 48px;display:inline-block">
                                                        <span style="color:#ffffff;font-size:36px;font-weight:700;letter-spacing:8px;font-family:monospace">{{otp}}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Expiry Note -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:24px">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <p style="color:#71717a;font-size:14px;line-height:20px;margin:0">
                                                        ⏱️ This code expires in <strong style="color:#f43f5e">10 minutes</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Security Warning -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#27272a;border-radius:8px;padding:16px;margin-top:32px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p style="color:#a1a1aa;font-size:14px;line-height:20px;margin:0">
                                                        If you didn't request this password reset, you can safely ignore this email. Someone might have typed your email address by mistake.
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 24px">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <p style="color:#52525b;font-size:12px;line-height:20px;margin:0">
                                        © 2024 CS2 Boost. All rights reserved.<br/>
                                        <a href="#" style="color:#3b82f6;text-decoration:underline">Unsubscribe</a> · <a href="#" style="color:#3b82f6;text-decoration:underline">Privacy Policy</a>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`,
    },
    {
        name: 'announcement',
        subject: '{{title}} - CS2 Boost',
        variables: ['title', 'content', 'image'],
        description: 'Broadcast announcement to all users',
        html_content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;padding:20px 0 48px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <!-- Logo -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:24px 24px 16px">
                        <tbody>
                            <tr>
                                <td>
                                    <img alt="CS2 Boost" height="40" src="https://res.cloudinary.com/du93troxt/image/upload/v1734800686/logo_j0xyfu.png" style="display:block;outline:none;border:none;text-decoration:none" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Main Card -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#18181b;border-radius:12px;border:1px solid #27272a;overflow:hidden">
                        <tbody>
                            <!-- Header Banner -->
                            <tr>
                                <td style="background:linear-gradient(135deg,#3b82f6 0%,#06b6d4 100%);padding:32px">
                                    <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;text-align:center">📢 {{title}}</h1>
                                </td>
                            </tr>
                            
                            <!-- Image -->
                            <tr>
                                <td style="padding:0">
                                    <img src="{{image}}" alt="Announcement Banner" style="width:100%;height:auto;display:block" />
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding:32px">
                                    <p style="color:#e4e4e7;font-size:16px;line-height:26px;margin:0;white-space:pre-wrap">{{content}}</p>
                                    
                                    <!-- CTA Button -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <a href="http://localhost:3000" style="background:linear-gradient(135deg,#3b82f6 0%,#8b5cf6 100%);color:#fff;font-size:14px;font-weight:600;text-decoration:none;text-align:center;display:inline-block;padding:12px 32px;border-radius:8px">
                                                        Visit CS2 Boost →
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 24px">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <p style="color:#52525b;font-size:12px;line-height:20px;margin:0">
                                        You're receiving this because you're subscribed to CS2 Boost announcements.<br/>
                                        <a href="#" style="color:#3b82f6;text-decoration:underline">Unsubscribe</a> · <a href="#" style="color:#3b82f6;text-decoration:underline">Privacy Policy</a>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`,
    },
    {
        name: 'password_reset_by_admin',
        subject: 'Your Password Has Been Reset - CS2 Boost',
        variables: ['username', 'password'],
        description: 'Sent when admin resets a user password',
        html_content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;padding:20px 0 48px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:24px 24px 16px">
                        <tbody>
                            <tr>
                                <td>
                                    <img alt="CS2 Boost" height="40" src="https://res.cloudinary.com/du93troxt/image/upload/v1734800686/logo_j0xyfu.png" style="display:block;outline:none;border:none;text-decoration:none" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#18181b;border-radius:12px;border:1px solid #27272a;padding:40px 32px">
                        <tbody>
                            <tr>
                                <td>
                                    <h1 style="color:#fafafa;font-size:28px;font-weight:700;margin:0 0 8px;padding:0">Password Reset 🔒</h1>
                                    <p style="color:#a1a1aa;font-size:16px;line-height:24px;margin:0 0 8px">Hey <strong style="color:#fafafa">{{username}}</strong>,</p>
                                    <p style="color:#a1a1aa;font-size:16px;line-height:24px;margin:0 0 24px">Your password has been reset by an administrator. Here are your new login credentials:</p>
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#27272a;border-radius:8px;padding:20px;margin:24px 0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p style="color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px">Your New Credentials</p>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:8px 0;border-bottom:1px solid #3f3f46">
                                                                <span style="color:#71717a;font-size:14px">Username</span>
                                                            </td>
                                                            <td style="padding:8px 0;border-bottom:1px solid #3f3f46;text-align:right">
                                                                <span style="color:#fafafa;font-size:14px;font-weight:600">{{username}}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:8px 0">
                                                                <span style="color:#71717a;font-size:14px">New Password</span>
                                                            </td>
                                                            <td style="padding:8px 0;text-align:right">
                                                                <code style="background-color:#3f3f46;color:#22c55e;padding:4px 8px;border-radius:4px;font-size:14px;font-family:monospace">{{password}}</code>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:32px 0">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <a href="http://localhost:3000/login" style="background:linear-gradient(135deg,#3b82f6 0%,#8b5cf6 100%);color:#fff;font-size:14px;font-weight:600;text-decoration:none;text-align:center;display:inline-block;padding:12px 32px;border-radius:8px">Login to Your Account →</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#7f1d1d;border:1px solid #b91c1c;border-radius:8px;padding:16px;margin-top:24px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p style="color:#fca5a5;font-size:14px;line-height:20px;margin:0"><strong>⚠️ Important:</strong> Please change your password immediately after logging in.</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 24px">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <p style="color:#52525b;font-size:12px;line-height:20px;margin:0">© 2024 CS2 Boost. All rights reserved.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`,
    },
    {
        name: 'payment_success',
        subject: 'Payment Confirmed - CS2 Boost #{{boostId}}',
        variables: [
            'username',
            'orderTitle',
            'orderAmount',
            'transactionId',
            'paymentDate',
            'boostId',
        ],
        description: 'Sent to users when their order payment is successful',
        html_content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:#0f0f0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif">
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;padding:20px 0 48px">
        <tbody>
            <tr style="width:100%">
                <td>
                    <!-- Logo -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:24px 24px 16px">
                        <tbody>
                            <tr>
                                <td>
                                    <img alt="CS2 Boost" height="40" src="https://res.cloudinary.com/du93troxt/image/upload/v1734800686/logo_j0xyfu.png" style="display:block;outline:none;border:none;text-decoration:none" />
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Main Card -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#18181b;border-radius:12px;border:1px solid #27272a;overflow:hidden">
                        <tbody>
                            <!-- Success Header -->
                            <tr>
                                <td style="background:linear-gradient(135deg,#22c55e 0%,#10b981 100%);padding:32px;text-align:center">
                                    <div style="font-size:48px;margin-bottom:12px">✓</div>
                                    <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0">Payment Successful!</h1>
                                    <p style="color:#dcfce7;font-size:14px;margin:8px 0 0">Your order has been confirmed</p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding:32px">
                                    <p style="color:#a1a1aa;font-size:16px;line-height:24px;margin:0 0 24px">Hey <strong style="color:#fafafa">{{username}}</strong>,</p>
                                    <p style="color:#a1a1aa;font-size:16px;line-height:24px;margin:0 0 24px">Thank you for your purchase! We've received your payment and your boost order is now being processed.</p>
                                    
                                    <!-- Order Details Box -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#27272a;border-radius:8px;padding:20px;margin:24px 0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p style="color:#a1a1aa;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 16px">Order Details</p>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td style="padding:10px 0;border-bottom:1px solid #3f3f46">
                                                                <span style="color:#71717a;font-size:14px">Order</span>
                                                            </td>
                                                            <td style="padding:10px 0;border-bottom:1px solid #3f3f46;text-align:right">
                                                                <span style="color:#fafafa;font-size:14px;font-weight:600">{{orderTitle}}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:10px 0;border-bottom:1px solid #3f3f46">
                                                                <span style="color:#71717a;font-size:14px">Boost ID</span>
                                                            </td>
                                                            <td style="padding:10px 0;border-bottom:1px solid #3f3f46;text-align:right">
                                                                <code style="background-color:#3f3f46;color:#3b82f6;padding:4px 8px;border-radius:4px;font-size:13px;font-family:monospace">{{boostId}}</code>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:10px 0;border-bottom:1px solid #3f3f46">
                                                                <span style="color:#71717a;font-size:14px">Transaction ID</span>
                                                            </td>
                                                            <td style="padding:10px 0;border-bottom:1px solid #3f3f46;text-align:right">
                                                                <span style="color:#a1a1aa;font-size:14px">{{transactionId}}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:10px 0;border-bottom:1px solid #3f3f46">
                                                                <span style="color:#71717a;font-size:14px">Payment Date</span>
                                                            </td>
                                                            <td style="padding:10px 0;border-bottom:1px solid #3f3f46;text-align:right">
                                                                <span style="color:#a1a1aa;font-size:14px">{{paymentDate}}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding:10px 0">
                                                                <span style="color:#71717a;font-size:14px;font-weight:600">Total Amount</span>
                                                            </td>
                                                            <td style="padding:10px 0;text-align:right">
                                                                <span style="color:#22c55e;font-size:18px;font-weight:700">{{orderAmount}}</span>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- CTA Button -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:32px 0">
                                        <tbody>
                                            <tr>
                                                <td align="center">
                                                    <a href="http://localhost:3000/orders" style="background:linear-gradient(135deg,#3b82f6 0%,#8b5cf6 100%);color:#fff;font-size:14px;font-weight:600;text-decoration:none;text-align:center;display:inline-block;padding:14px 36px;border-radius:8px">
                                                        View My Orders →
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Info Note -->
                                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#172554;border:1px solid #1e40af;border-radius:8px;padding:16px;margin-top:24px">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <p style="color:#93c5fd;font-size:14px;line-height:20px;margin:0">
                                                        <strong>📋 What's next?</strong> A partner will pick up your order and start boosting soon. You can track the progress in your orders page.
                                                    </p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding:32px 24px">
                        <tbody>
                            <tr>
                                <td align="center">
                                    <p style="color:#52525b;font-size:12px;line-height:20px;margin:0">
                                        © 2024 CS2 Boost. All rights reserved.<br/>
                                        <a href="#" style="color:#3b82f6;text-decoration:underline">Unsubscribe</a> · <a href="#" style="color:#3b82f6;text-decoration:underline">Privacy Policy</a>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>`,
    },
];

export const seedEmailTemplates = async () => {
    try {
        for (const template of defaultTemplates) {
            const existing = await EmailTemplate.findOne({ name: template.name });
            if (!existing) {
                await EmailTemplate.create(template);
                console.log(`✓ Created email template: ${template.name}`);
            }
        }
        console.log('Email templates seeding completed.');
    } catch (error) {
        console.error('Error seeding email templates:', error);
    }
};