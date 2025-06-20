const Joi = require('joi');

// Registration validation schema
const registrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Paramter email tidak sesuai format',
    'any.required': 'Email is required'
  }),
  first_name: Joi.string().min(1).max(100).required().messages({
    'any.required': 'First name is required'
  }),
  last_name: Joi.string().min(1).max(100).required().messages({
    'any.required': 'Last name is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password minimum 8 karakter',
    'any.required': 'Password is required'
  })
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Paramter email tidak sesuai format',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password minimum 8 karakter',
    'any.required': 'Password is required'
  })
});

// Profile update validation schema
const profileUpdateSchema = Joi.object({
  first_name: Joi.string().min(1).max(100).required(),
  last_name: Joi.string().min(1).max(100).required()
});

// Top up validation schema
const topupSchema = Joi.object({
  top_up_amount: Joi.number().positive().required().messages({
    'number.positive': 'Parameter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
    'any.required': 'Top up amount is required'
  })
});

// Transaction validation schema
const transactionSchema = Joi.object({
  service_code: Joi.string().required().messages({
    'any.required': 'Service code is required'
  })
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      const message = error.details[0].message;
      let status = 102;
      
      // Map specific error messages to status codes
      if (message.includes('email')) {
        status = 102;
      } else if (message.includes('amount')) {
        status = 102;
      }
      
      return res.status(400).json({
        status: status,
        message: message,
        data: null
      });
    }
    
    req.validatedData = value;
    next();
  };
};

module.exports = {
  validate,
  registrationSchema,
  loginSchema,
  profileUpdateSchema,
  topupSchema,
  transactionSchema
};