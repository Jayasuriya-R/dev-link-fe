export const connectionRequestEmail = (firstName,sender) => `
  Hi ${firstName},<br><br>
  Great news!<br><br>
  ${sender} is interested in connecting with you on DevLink. 
  Log in to your account to view their profile and start a conversation.<br>
  We're excited to see your network grow.<br><br>
  Happy networking!<br>
`;

export const welcomeEmail = (firstName) => `
  Hi ${firstName},<br><br>
  Welcome to DevLink! 🎉<br><br>
  Your account has been successfully created. You can now log in and start exploring your dashboard.<br><br>
  If you ever need assistance, feel free to reach out.<br><br>
  
`;

export const connectionAcceptedEmail = (firstName, acceptedByName) => `
  Hi ${firstName},<br><br>
  Good news! 🎉<br><br>
  <b>${acceptedByName}</b> has accepted your connection request on DevLink.<br><br>
  You can now view their profile and start a conversation.<br>
  We're glad to see your professional network growing!<br><br>
  Happy networking!<br>

`;