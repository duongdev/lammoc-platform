/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  // serverBuildTarget: 'vercel',
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: ['**/.*'],
  future: {
    v2_routeConvention: true,
    v2_meta: true,
    v2_errorBoundary: false
  },
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
}
