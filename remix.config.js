/**
 * @type {import('@remix-run/dev').AppConfig}
 */

const { flatRoutes } = require('remix-flat-routes')

module.exports = {
  serverBuildTarget: process.env.VERCEL ? 'vercel' : undefined,
  server:
    process.env.NODE_ENV === 'development' || !process.env.VERCEL
      ? undefined
      : './server.vercel.js',
  ignoredRouteFiles: ['**/.*'],
  future: {
    v2_routeConvention: true,
    v2_meta: true,
    v2_errorBoundary: false,
    unstable_dev: true,
  },
  routes: (defineRoutes) => {
    return flatRoutes('routes', defineRoutes)
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
}
