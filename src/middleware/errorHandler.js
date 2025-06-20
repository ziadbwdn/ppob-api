const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Default error response
    let status = 500;
    let message = 'Internal server error';
    let statusCode = 500;
  
    // Handle specific error types
    if (err.code === 'ER_DUP_ENTRY') {
      status = 102;
      message = 'Email sudah terdaftar';
      statusCode = 400;
    } else if (err.code === 'ENOENT') {
      status = 102;
      message = 'File not found';
      statusCode = 400;
    } else if (err.type === 'entity.too.large') {
      status = 102;
      message = 'File size too large';
      statusCode = 400;
    }
  
    res.status(statusCode).json({
      status: status,
      message: message,
      data: null
    });
  };
  
  module.exports = errorHandler;