import Joi from 'joi';

// SignUp Validation
const registrationSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Full name must be a string.',
    'string.min': 'Full name must be at least 3 characters long.',
    'string.max': 'Full name must be at most 100 characters long.',
    'any.required': 'Full name is required.',
  }),

  email: Joi.string().email().max(150).required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Please provide a valid email address.',
    'string.max': 'Email must be at most 150 characters long.',
    'any.required': 'Email is required.',
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,20}$/)
    .required()
    .messages({
      'string.base': 'Phone number must be a string.',
      'string.pattern.base': 'Phone number must be between 10 and 20 digits.',
      'any.required': 'Phone number is required.',
    }),

  password: Joi.string().min(6).max(255).required().messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 6 characters long.',
    'string.max': 'Password must be at most 255 characters long.',
    'any.required': 'Password is required.',
  }),

  role: Joi.string().valid('admin', 'lab_owner', 'doctor', 'user').default('user').messages({
    'string.base': 'Role must be a string.',
    'any.only': 'Role must be one of "admin", "lab_owner", "doctor", or "user".',
  }),

  status: Joi.string().valid('active', 'inactive', 'suspended').default('active').messages({
    'string.base': 'Status must be a string.',
    'any.only': 'Status must be one of "active", "inactive", or "suspended".',
  }),

  is_deleted: Joi.boolean().default(false).messages({
    'boolean.base': 'is_deleted must be a boolean.',
  }),
});

export const validateRegistration = (req, res, next) => {
  const { error } = registrationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: error.details.map((err) => err.message),
    });
  }

  next();
};

// SignIn Validation
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string.',
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),

  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string.',
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  })
});

export const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }

  next();
};


// Lab Validation
const labValidationSchema1 = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  contact_email: Joi.string().email().required(),
  contact_phone: Joi.string()
      .pattern(/^[0-9]{10}$/) // Ensures exactly 10 digits
      .required(),
  address: Joi.string().min(5).max(100).required(),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).required(),
  country: Joi.string().min(2).max(50).required(),
  pincode: Joi.string()
      .pattern(/^[0-9]{6}$/) // Ensures exactly 6 digits
      .required(),
});

export const validateLabData1 = (req, res, next) => {
  const { error } = labValidationSchema.validate(req.body, { abortEarly: false });

  if (error) {
      return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }
  next();
};


const labValidationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  logo_url: Joi.string().uri().optional(),
  contact_email: Joi.string().email().max(150).required(),
  contact_phone: Joi.string()
    .pattern(/^[0-9]{10}$/) // Ensures exactly 10 digits
    .required(),
  address: Joi.string().min(5).required(),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string().min(2).max(50).required(),
  country: Joi.string().min(2).max(50).required(),
  pincode: Joi.string()
    .pattern(/^[0-9]{6}$/) // Ensures exactly 6 digits
    .required(),
  latitude: Joi.number().precision(6).optional(),
  longitude: Joi.number().precision(6).optional(),
  website_url: Joi.string().uri().optional(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid("active", "inactive", "suspended").optional(),
  is_deleted: Joi.boolean().optional(),
});

export const validateLabData = (req, res, next) => {
  const { error } = labValidationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({ errors: error.details.map((err) => err.message) });
  }
  next();
};




