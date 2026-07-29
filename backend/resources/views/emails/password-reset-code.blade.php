<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: #0a0c0a; padding: 32px; text-align: center; }
    .header h1 { color: #a7ef9e; font-size: 24px; margin: 0; letter-spacing: 1px; }
    .body { padding: 36px 40px; text-align: center; }
    .body p { color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 24px; }
    .code { display: inline-block; font-size: 40px; font-weight: 700; letter-spacing: 10px; color: #0a0c0a; background: #a7ef9e; border-radius: 10px; padding: 16px 32px; margin: 8px 0 24px; }
    .note { font-size: 13px; color: #999; }
    .footer { padding: 20px; background: #f9f9f9; text-align: center; font-size: 12px; color: #bbb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Claro</h1>
    </div>
    <div class="body">
      <p>You requested a password reset. Use the code below to set a new password.</p>
      <div class="code">{{ $code }}</div>
      <p class="note">This code expires in <strong>15 minutes</strong>. If you didn&apos;t request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; {{ date('Y') }} Claro. All rights reserved.
    </div>
  </div>
</body>
</html>
