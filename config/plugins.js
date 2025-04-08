module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'sendgrid',
        providerOptions: {
          apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
          defaultFrom: 'contact@kohua.in',
          defaultReplyTo: 'contact@kohua.in',
        },
      },
    },

  });