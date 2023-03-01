/**
 * @type {import('@remix-run/dev').AppConfig}
 */

module.exports = {
  serverBuildTarget: process.env.VERCEL ? 'vercel' : undefined,
  server:
    process.env.NODE_ENV === 'development' || !process.env.VERCEL
      ? undefined
      : './server.js',
  ignoredRouteFiles: ['**/.*'],
  future: {
    v2_routeConvention: true,
    v2_meta: true,
    v2_errorBoundary: true,
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
}
