export const globalErrorHandler = (err, req, res) => {
    console.error(err);
    res.status(err.status || 500).end();
};
