// module.exports = {
//     user: process.env.EMAIL_USER, 
//     password: process.env.EMAIL_PASSWORD, 
//     host: process.env.EMAIL_HOST, 
//     port: process.env.EMAIL_PORT || 993, 
//     tls: true,
//     tlsOptions: { rejectUnauthorized: false }

//   };
  

module.exports = {
  emailConfig: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    tls: true,
    tlsOptions: { 
      rejectUnauthorized: false 
    },
    // Add these additional options
    autotls: 'always',
    connTimeout: 10000,
    authTimeout: 10000
  }
};