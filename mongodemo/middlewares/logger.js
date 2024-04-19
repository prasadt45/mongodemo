function loggerMw(req, res, next){
    console.log(`[${req.ip}]:\tHTTP Method ${req.method}:\tLogger ${new Date().toLocaleString()}`);
    req.isAuthenticated = true;
    next();
}

module.exports = loggerMw;