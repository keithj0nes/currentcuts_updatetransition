module.exports = {
  port: 3010,
  SESSION_SECRET: 'heresasecretLOL',
  facebookAuth: {
    clientID: '1337749596296570',
    clientSecret: '5df01bd8d0b556a8dc9f924d6f540d4f',
    callbackURL: 'http://localhost:3010/auth/facebook/callback'
  },
  stripeKey:"pk_test_o4WwpsoNcyJHEKTa6nJYQSUU",

  psqlConnString: "postgres://vqjaskbb:PK2AO0SsZ6AdjIZvygxZfSNTQnxsyZKD@babar.elephantsql.com:5432/vqjaskbb"
}
