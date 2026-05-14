const frontendUrl = process.env.FRONTEND_URL;

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://olawale-silk.vercel.app'];
if (frontendUrl) allowedOrigins.push(frontendUrl);

export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      keepHeaderOnError: true,
    },
  },
  'strapi::compression',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
