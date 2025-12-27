// Environment-based configuration
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    db: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'saas_user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'saas_dev'
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
      expiresIn: '24h'
    },
    server: {
      port: process.env.PORT || 5000,
      corsOrigin: 'http://localhost:3000'
    },
    logging: {
      level: 'debug'
    }
  },
  staging: {
    db: {
      host: process.env.DB_HOST || 'staging-db.example.com',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'saas_staging'
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    server: {
      port: process.env.PORT || 5000,
      corsOrigin: process.env.CORS_ORIGIN
    },
    logging: {
      level: 'info'
    }
  },
  production: {
    db: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'saas_prod',
      ssl: true
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: '24h'
    },
    server: {
      port: process.env.PORT || 5000,
      corsOrigin: process.env.CORS_ORIGIN,
      trustProxy: true
    },
    logging: {
      level: 'error'
    }
  }
};

module.exports = config[env];
