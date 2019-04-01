export const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).end();
};
