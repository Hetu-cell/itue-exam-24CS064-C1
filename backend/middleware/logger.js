// Custom requestLogger middleware logging [METHOD] [PATH] [STATUS] [RESPONSE-TIME ms]
const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${req.method}] ${req.originalUrl || req.url} ${res.statusCode} ${duration}ms`);
  });

  next();
};

module.exports = requestLogger;
