const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/app",
    createProxyMiddleware({
      target: "https://stratezylabs.ai",
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        // Forward Authorization header if present
        if (req.headers.authorization) {
          proxyReq.setHeader("Authorization", req.headers.authorization);
        }
      },
    })
  );
};
