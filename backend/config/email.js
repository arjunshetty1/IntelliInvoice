module.exports = {
    user: process.env.EMAIL_USER, 
    password: process.env.EMAIL_PASSWORD, 
    host: process.env.EMAIL_HOST, 
    port: process.env.EMAIL_PORT || 993, 
    tls: process.env.EMAIL_TLS === 'true', 
  };
  