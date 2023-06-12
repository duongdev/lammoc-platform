/**
 * @type {import('@remix-run/dev').AppConfig}
 */

const path = require('path')

const { flatRoutes } = require('remix-flat-routes')

module.exports = {
  serverBuildTarget: process.env.VERCEL ? 'vercel' : undefined,
  // server:
  //   process.env.NODE_ENV === 'development' || !process.env.VERCEL
  //     ? undefined
  //     : './server.vercel.js',
  serverModuleFormat: 'cjs',
  ignoredRouteFiles: ['**/*'],
  future: {
    v2_routeConvention: true,
    v2_meta: true,
    v2_errorBoundary: true,
    unstable_dev: true,
    v2_normalizeFormMethod: true,
    v2_headers: true,
  },
  routes: (defineRoutes) => {
    return flatRoutes('routes', defineRoutes, {
      appDir: path.resolve(__dirname, 'app'),
    })
  },
}
