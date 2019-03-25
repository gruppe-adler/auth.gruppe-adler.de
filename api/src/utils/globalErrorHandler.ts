export const globalErrorHandler = function(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send(err.message || err);
}