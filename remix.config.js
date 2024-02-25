/** @type {import('@remix-run/dev').AppConfig} */
export default {
  serverDependenciesToBundle: [/remix-utils/],
  ignoredRouteFiles: ["**/*.css"],
  // serverModuleFormat: "cjs",
  tailwind: true,
  postcss: true,
  // serverModuleFormat: "cjs",
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
