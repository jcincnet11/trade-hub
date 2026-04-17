import pino from 'pino'

// Single shared pino instance for server code (route handlers, coingecko helpers).
// Client-side (error boundaries, hooks) still uses console.* — pino is Node-only.
//
// Dev: pretty-printed via pino-pretty. Prod: JSON on stdout (ready for Vercel log drains).
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss.l', ignore: 'pid,hostname' },
    },
  }),
})
