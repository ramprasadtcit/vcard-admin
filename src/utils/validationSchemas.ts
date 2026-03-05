import * as yup from 'yup';

export const editProfileSchema = yup.object().shape({
  fullName: yup.string()
    .required('Full Name is required')
    .matches(/^[A-Za-z ]+$/, 'Full Name can only contain alphabets'),
  jobTitle: yup.string()
    .matches(/^[A-Za-z ]*$/, 'Job Title can only contain alphabets'),
  company: yup.string()
    .matches(/^[A-Za-z ]*$/, 'Company can only contain alphabets'),
  username: yup.string()
    .required('A unique URL is required')
    .min(3, 'URL must be at least 3 characters')
    .matches(/^[a-z0-9]+$/, 'URL can only contain lowercase letters, numbers'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  website: yup.string()
    .notRequired()
    .test('is-url-or-empty', 'Invalid URL format', value => {
      if (!value || value.trim() === '') return true;
      return /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i.test(value);
    }),
  address: yup.object().shape({
    street: yup.string(),
    city: yup.string(),
    state: yup.string(),
    zipCode: yup.string(),
    country: yup.string(),
  }),
  bio: yup.string().max(500, 'Bio must not exceed 500 characters'),
  phoneNumber: yup.object().shape({
    value: yup.string()
      .required('Primary phone number is required')
      .matches(/^[0-9+\s\-()]+$/, 'Phone number can only contain numbers, spaces, hyphens, and parentheses')
      .test('no-alphabets', 'Phone number cannot contain alphabets', function(value) {
        if (!value) return true;
        return !/[a-zA-Z]/.test(value);
      }),
    country: yup.string(),
  }),
  additionalEmails: yup
    .array()
    .of(
      yup.object({
        value: yup.string().email('Invalid email format').notRequired(),
      })
    )
    .nullable()
    .optional(),
  phoneNumbers: yup
    .array()
    .of(
      yup.object({
        value: yup
          .string()
          .nullable()
          .test('no-alphabets', 'Phone number cannot contain alphabets', function(value) {
            if (!value) return true;
            return !/[a-zA-Z]/.test(value);
          })
          .matches(/^[0-9+\s\-()]*$/, 'Phone number can only contain numbers, spaces, hyphens, and parentheses'),
        country: yup.string().nullable(),
      })
    )
    .nullable()
    .optional(),
  socialLinks: yup.array().of(
    yup.object().shape({
      platform: yup.string().optional(),
      url: yup.string().optional(),
    })
  ),
}); 