import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  parsePhoneNumber,
  getCountryCallingCode,
} from "react-phone-number-input";
import PhoneInput from "react-phone-number-input";
import { normalizePhoneData, getSafeCountryCode } from "../../utils/phoneUtils";
import SafePhoneInput from "../../components/SafePhoneInput";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Select from "react-select";
import {
  User,
  MapPin,
  Globe,
  Linkedin,
  X as Twitter,
  Instagram,
  Camera,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Mail,
  Plus,
  X,
} from "lucide-react";
import { FFUser } from "../../types/user";
import { ComingSoonOverlay } from "../../components";
import { countries } from "../../data";
import twintikLogo from "../../assets/twintik-logo.svg";
import { apiService } from "../../services/api";
import imageCompression from "browser-image-compression";

// Custom styles for react-select to match the existing design
const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    border: state.isFocused ? "2px solid #8b5cf6" : "1px solid #d1d5db",
    borderRadius: "0.375rem",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(139, 92, 246, 0.1)" : "none",
    minHeight: "42px",
    "&:hover": {
      border: "1px solid #8b5cf6",
    },
    "&:focus-within": {
      border: "2px solid #8b5cf6",
      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
    },
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#8b5cf6"
      : state.isFocused
      ? "#f3f4f6"
      : "white",
    color: state.isSelected ? "white" : "#374151",
    padding: "8px 12px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: state.isSelected ? "#8b5cf6" : "#f3f4f6",
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#374151",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#374151",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#6b7280",
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    backgroundColor: "#d1d5db",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: "#9ca3af",
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    color: "#9ca3af",
    "&:hover": {
      color: "#6b7280",
    },
  }),
};

interface ProfileFormData {
  // Basic Info
  fullName: string;
  jobTitle: string;
  company: string;
  website: string;
  profileUrl: string;

  // Contact Details
  email: string;
  additionalEmails: string[];
  phone: string;
  additionalPhones: string[];

  // Address
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  // Social Links
  socialLinks: {
    linkedin: string;
    x: string;
    instagram: string;
    [key: string]: string;
  };

  // Custom Social Links
  customSocialLinks: Array<{
    platform: string;
    url: string;
  }>;

  // Profile Picture
  profilePicture: string;

  // Bio
  bio: string;
}

// Validation schema for the form (excluding password)
const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full Name is required")
    .min(2, "Full Name must be at least 2 characters")
    .max(100, "Full Name cannot exceed 100 characters"),
  jobTitle: Yup.string()
    .required("Job Title is required")
    .max(100, "Job Title cannot exceed 100 characters"),
  company: Yup.string()
    .required("Company is required")
    .max(100, "Company name cannot exceed 100 characters"),
  website: Yup.string()
    .test("website-url", "Please enter a valid website URL", function (value) {
      if (!value || value.trim() === "") return true; // Allow empty
      return /^https?:\/\/.+/.test(value);
    })
    .optional(),
  profileUrl: Yup.string()
    .matches(
      /^[a-z0-9]+$/,
      "Profile URL must be lowercase letters and numbers only"
    )
    .required("Profile URL is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Primary Phone Number is required")
    .test(
      "phone-format",
      "Please enter a valid phone number",
      function (value) {
        if (!value) return false;
        // Use the built-in validation from react-phone-number-input
        return isValidPhoneNumber(value);
      }
    ),
  bio: Yup.string().max(500, "Bio cannot exceed 500 characters").optional(),
  // Validate additional emails
  additionalEmails: Yup.array().of(
    Yup.string().email("Invalid email address").optional()
  ),
  // Validate additional phones
  additionalPhones: Yup.array().of(
    Yup.string().test(
      "phone-format",
      "Please enter a valid phone number",
      function (value) {
        console.log("Validating additional phone:", value); // Debug log

        // If the field is empty, it's valid (optional field)
        if (!value || value.trim() === "") {
          console.log("Empty phone field - valid"); // Debug log
          return true;
        }

        // If there's a value, it must be a valid phone number
        const isValid = isValidPhoneNumber(value);
        console.log("Phone validation result:", isValid); // Debug log

        if (!isValid) {
          console.log("Invalid phone number detected:", value); // Debug log
          return this.createError({
            message: "Please enter a valid phone number",
          });
        }
        return true;
      }
    )
  ),
  // Social links validation
  socialLinks: Yup.object().shape({
    linkedin: Yup.string()
      .test(
        "linkedin-url",
        "LinkedIn URL must start with http:// or https://",
        function (value) {
          if (!value || value.trim() === "") return true; // Allow empty
          return /^https?:\/\/.+/.test(value);
        }
      )
      .optional(),
    x: Yup.string()
      .test(
        "x-url",
        "X URL must start with http:// or https://",
        function (value) {
          if (!value || value.trim() === "") return true; // Allow empty
          return /^https?:\/\/.+/.test(value);
        }
      )
      .optional(),
    instagram: Yup.string()
      .test(
        "instagram-url",
        "Instagram URL must start with http:// or https://",
        function (value) {
          if (!value || value.trim() === "") return true; // Allow empty
          return /^https?:\/\/.+/.test(value);
        }
      )
      .optional(),
  }),
  // Custom social links validation
  customSocialLinks: Yup.array().of(
    Yup.object().shape({
      platform: Yup.string().optional(),
      url: Yup.string()
        .test(
          "custom-url",
          "URL must start with http:// or https://",
          function (value) {
            if (!value || value.trim() === "") return true; // Allow empty
            return /^https?:\/\/.+/.test(value);
          }
        )
        .optional(),
    })
  ),
});

const FFUserProfileSetup: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [userAlreadyRegistered, setUserAlreadyRegistered] = useState(false);
  const [invitationNotFound, setInvitationNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [invitationId, setInvitationId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    jobTitle: "",
    company: "",
    website: "",
    profileUrl: "",
    email: "",
    additionalEmails: [""],
    phone: "",
    additionalPhones: [""],
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "", // No default value - let user select
    },
    socialLinks: {
      linkedin: "",
      x: "",
      instagram: "",
    },
    customSocialLinks: [],
    profilePicture: "",
    bio: "",
  });

  // Username check/suggestion state
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(
    null
  );
  const [usernameCheckError, setUsernameCheckError] = useState<string | null>(
    null
  );

  // Validate invitation token on page load
  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        // Call the new backend endpoint to validate invitation by token
        const response: any = await apiService.get(
          `/invitation/token/${token}`
        );
        console.log("Invitation validation response:", response);

        if (response && response.invitation) {
          // Normalize phone data in invitation response
          const normalizedInvitation = normalizePhoneData(response.invitation);

          // Token is valid, set invitation data
          setTokenValid(true);
          setTokenExpired(false);
          setInvitationId(normalizedInvitation._id);

          // Pre-fill form with invitation data
          setFormData((prev) => ({
            ...prev,
            fullName: normalizedInvitation.fullName || "",
            email: normalizedInvitation.emailAddress || "",
          }));

          // Check if user is already registered by checking if invitation has userId
          if (response.invitation.userId) {
            // User is already registered, show appropriate message
            setTokenValid(false);
            setTokenExpired(false);
            setUserAlreadyRegistered(true);
          }
        }
      } catch (error: any) {
        console.error("Error validating invitation token:", error);

        // Handle different error cases
        if (error.response?.status === 410) {
          // Invitation expired
          setTokenExpired(true);
          setTokenValid(false);
        } else if (
          error.response?.status === 400 &&
          error.response?.data?.completed
        ) {
          // Invitation already used (user already registered)
          setTokenValid(false);
          setTokenExpired(false);
          setUserAlreadyRegistered(true);
        } else if (error.response?.status === 404) {
          // Invitation not found
          setTokenValid(false);
          setTokenExpired(false);
          setInvitationNotFound(true);
        } else {
          // Other errors
          setTokenValid(false);
          setTokenExpired(false);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  useEffect(() => {
    console.log("Email changed:", formData.email); // Debug log
    if (formData.email) {
      console.log("Fetching suggestions for email:", formData.email); // Debug log
      setCheckingUsername(true);
      apiService
        .getUsernameSuggestions(formData.email)
        .then((res) => {
          console.log("Suggestions received:", res); // Debug log
          setUsernameSuggestions(res.data?.suggestions || []);
        })
        .catch((err) => {
          console.error("Error fetching suggestions:", err); // Debug log
          setUsernameSuggestions([]);
        })
        .finally(() => setCheckingUsername(false));
    }
  }, [formData.email]);

  // Also fetch suggestions when component mounts if email is already available
  useEffect(() => {
    if (formData.email && usernameSuggestions.length === 0) {
      console.log("Initial fetch for suggestions with email:", formData.email); // Debug log
      setCheckingUsername(true);
      apiService
        .getUsernameSuggestions(formData.email)
        .then((res) => {
          console.log("Initial suggestions received:", res); // Debug log
          setUsernameSuggestions(res.data?.suggestions || []);
        })
        .catch((err) => {
          console.error("Error fetching initial suggestions:", err); // Debug log
          setUsernameSuggestions([]);
        })
        .finally(() => setCheckingUsername(false));
    }
  }, []); // Run only once on mount

  const handleCheckUsername = async () => {
    setCheckingUsername(true);
    setUsernameCheckError(null);
    setUsernameAvailable(null);
    try {
      const username = formData.profileUrl.replace("twintik.com/", "");
      const res = await apiService.checkUsernameAvailability(username);
      setUsernameAvailable(res.data?.available);
      // Do NOT update suggestions here
      if (!res.data?.available) {
        setUsernameCheckError(
          "This URL is already taken. Please choose another or pick a suggestion."
        );
      }
    } catch (err) {
      setUsernameCheckError("Failed to check URL. Please try again.");
    } finally {
      setCheckingUsername(false);
    }
  };

  const handlePickSuggestion = async (suggestion: string) => {
    setFormData((prev) => ({
      ...prev,
      profileUrl: suggestion, // Only set the username, not the full URL
    }));
    setSelectedSuggestion(suggestion);
    setUsernameAvailable(null); // Reset availability check
    setUsernameCheckError(null);
    // Automatically check availability for the selected suggestion
    try {
      setCheckingUsername(true);
      const res = await apiService.checkUsernameAvailability(suggestion);
      setUsernameAvailable(res.data?.available);
      if (res.data?.available) {
        setUsernameCheckError(null);
      } else {
        setUsernameCheckError(
          "This URL is already taken. Please choose another or pick a suggestion."
        );
      }
    } catch (err) {
      setUsernameCheckError("Failed to check URL. Please try again.");
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let newValue = value;
    if (field === "profileUrl") {
      // Remove any leading protocol and domain
      newValue = newValue
        .replace(/^https?:\/\/twintik\.com\//, "")
        .replace(/^https?:\/\//, "");
      // Remove any slashes
      newValue = newValue.replace(/\//g, "");
    }
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleAdditionalPhoneChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalPhones: prev.additionalPhones.map((phone, i) =>
        i === index ? value : phone
      ),
    }));
  };

  // Handler for primary phone input with formatting
  const handlePrimaryPhoneChange = (value: string | undefined) => {
    if (!value) {
      setFormData((prev) => ({
        ...prev,
        phone: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleAdditionalPhoneChangeWithFormat = (
    index: number,
    value: string | undefined
  ) => {
    if (!value) {
      setFormData((prev) => ({
        ...prev,
        additionalPhones: prev.additionalPhones.map((phone, i) =>
          i === index ? "" : phone
        ),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      additionalPhones: prev.additionalPhones.map((phone, i) =>
        i === index ? value : phone
      ),
    }));
  };

  const addAdditionalPhone = () => {
    if (formData.additionalPhones.length >= 3) {
      alert("Maximum 3 additional phone numbers allowed");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      additionalPhones: [...prev.additionalPhones, ""],
    }));
  };

  const removeAdditionalPhone = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalPhones: prev.additionalPhones.filter((_, i) => i !== index),
    }));
  };

  // Helper function to convert profile picture to base64
  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    if (!imageUrl) return "";

    // If it's already a base64 string, return as is
    if (imageUrl.startsWith("data:image")) {
      return imageUrl;
    }

    // For now, return empty string for external URLs
    // In a real implementation, you'd fetch the image and convert to base64
    return "";
  };

  // Helper function to validate image format
  const validateImageFormat = (file: File): boolean => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const allowedExtensions = [".png", ".jpeg", ".jpg", ".webp"];

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    return hasValidExtension;
  };

  // Helper function to validate image size (max 10MB)
  const validateImageSize = (file: File): boolean => {
    const maxSize = 7 * 1024 * 1024; // 10MB in bytes
    return file.size <= maxSize;
  };

  // Helper function to compress image
  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 2, // Compress to max 2MB
      maxWidthOrHeight: 1024, // Max width/height of 1024px
      useWebWorker: true,
      fileType: file.type,
    };

    try {
      console.log(
        "Original image size:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      const compressedFile = await imageCompression(file, options);
      console.log(
        "Compressed image size:",
        (compressedFile.size / 1024 / 1024).toFixed(2),
        "MB"
      );
      return compressedFile;
    } catch (error) {
      console.error("Image compression failed:", error);
      return file; // Return original file if compression fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});

    console.log("Form data being validated:", formData); // Debug log

    // Manual validation for additional phones to debug
    formData.additionalPhones.forEach((phone, index) => {
      console.log(`Additional phone ${index}:`, phone);
      if (phone && phone.trim() !== "") {
        const isValid = isValidPhoneNumber(phone);
        console.log(`Additional phone ${index} validation:`, isValid);
        if (!isValid) {
          console.log(`Additional phone ${index} is invalid:`, phone);
        }
      }
    });

    // Validate form
    try {
      await validationSchema.validate(formData, { abortEarly: false });
    } catch (err: any) {
      console.log("Validation failed with error:", err); // Debug log
      if (err.inner) {
        const errors: { [key: string]: string } = {};
        err.inner.forEach((validationError: any) => {
          if (validationError.path) {
            // Handle array field errors (additionalPhones, additionalEmails, customSocialLinks)
            if (
              validationError.path.includes("[") &&
              validationError.path.includes("]")
            ) {
              // Extract the array field name and index
              const match = validationError.path.match(
                /^(\w+)\[(\d+)\]\.?(\w+)?$/
              );
              if (match) {
                const [, fieldName, index, subField] = match;
                if (subField) {
                  errors[`${fieldName}.${index}.${subField}`] =
                    validationError.message;
                } else {
                  errors[`${fieldName}.${index}`] = validationError.message;
                }
              } else {
                errors[validationError.path] = validationError.message;
              }
            } else {
              errors[validationError.path] = validationError.message;
            }
          }
        });
        console.log("Validation errors:", errors); // Debug log
        console.log(
          "Original validation error paths:",
          err.inner.map((e: any) => e.path)
        ); // Debug log
        console.log("All validation errors:", err.inner); // Debug log
        setFormErrors(errors);

        // Scroll to first error
        const firstErrorField = document.querySelector('[data-error="true"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
      return;
    }

    setSaving(true);

    console.log("Form data being submitted:", formData);
    try {
      // Construct API payload in the required format
      const apiPayload = {
        fullName: formData.fullName,
        jobTitle: formData.jobTitle,
        company: formData.company,
        username: formData.profileUrl.replace("twintik.com/", ""),
        email: formData.email,
        bio: formData.bio || "",
        website: formData.website || "",
        address: {
          street: formData.address.street || "",
          city: formData.address.city || "",
          state: formData.address.state || "",
          zipCode: formData.address.zipCode || "",
          country: formData.address.country || "",
        },
        additionalEmails:
          formData.additionalEmails
            .filter((email) => email.trim() !== "")
            .join(",") || "",
        phoneNumber: {
          value: (() => {
            const phoneData = parsePhoneNumber(formData.phone);
            if (!phoneData) return formData.phone;
            const country = phoneData.country || "AE";
            const callingCode = getCountryCallingCode(country);
            const nationalNumber = phoneData.nationalNumber || "";
            return `+${callingCode} ${nationalNumber}`;
          })(),
          country: parsePhoneNumber(formData.phone)?.country || "AE",
        },
        phoneNumbers: formData.additionalPhones
          .filter((phone) => phone.trim() !== "")
          .map((phone) => ({
            value: (() => {
              const phoneData = parsePhoneNumber(phone);
              if (!phoneData) return phone;
              const country = phoneData.country || "AE";
              const callingCode = getCountryCallingCode(country);
              const nationalNumber = phoneData.nationalNumber || "";
              return `+${callingCode} ${nationalNumber}`;
            })(),
            country: parsePhoneNumber(phone)?.country || "AE",
          })),
        socialLinks: [
          // LinkedIn
          ...(formData.socialLinks.linkedin
            ? [
                {
                  platform: "linkedin",
                  url: formData.socialLinks.linkedin,
                  isPublic: true,
                },
              ]
            : []),
          // X (formerly Twitter)
          ...(formData.socialLinks.x
            ? [
                {
                  platform: "x",
                  url: formData.socialLinks.x,
                  isPublic: true,
                },
              ]
            : []),
          // Instagram
          ...(formData.socialLinks.instagram
            ? [
                {
                  platform: "instagram",
                  url: formData.socialLinks.instagram,
                  isPublic: true,
                },
              ]
            : []),
          // Custom social links
          ...formData.customSocialLinks
            .filter(
              (link) => link.platform.trim() !== "" && link.url.trim() !== ""
            )
            .map((link) => ({
              platform: link.platform.toLowerCase(),
              url: link.url,
              isPublic: true,
            })),
        ],
        profilePicture: await convertImageToBase64(formData.profilePicture),
        invitationId: invitationId,
      };

      console.log("API Payload:", apiPayload);
      debugger;

      // Call registerFromWeb API
      try {
        const registerRes = await apiService.post(
          "/profile/registerFromWeb",
          apiPayload
        );
        console.log("Registration successful:", registerRes);

        // Redirect to confirmation page
        navigate(`/onboard/${token}/confirmation`, {
          state: { username: formData.profileUrl.replace("twintik.com/", "") },
        });
      } catch (error: any) {
        console.error("Registration failed:", error);
        // Handle specific error cases
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert("Registration failed. Please try again.");
        }
      } finally {
        setSaving(false);
      }
    } catch (error) {
      console.error("Failed to register user:", error);
      setSaving(false);
    }
  };

  if (tokenExpired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invitation Expired
          </h1>
          <p className="text-gray-600">
            This invitation link has expired. Please contact the administrator
            to request a new invitation.
          </p>
        </div>
      </div>
    );
  }

  if (userAlreadyRegistered) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Already Registered
          </h1>
          <p className="text-gray-600">
            This invitation has already been used to create a profile. If you
            need to update your profile, please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  if (invitationNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Invitation
          </h1>
          <p className="text-gray-600">
            This invitation link is invalid or has been removed. Please contact
            the administrator for assistance.
          </p>
        </div>
      </div>
    );
  }

  // Show loading while validating or if token is not valid
  if (loading || !tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating your invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src={twintikLogo} alt="TwinTik Logo" className="w-20 h-5" />
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Digital Card Setup
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Complete Your Digital Card Profile
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Fill in your details to create your personalized digital business
              card. Our team will review and configure your NFC card for
              sharing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8" noValidate>
            {/* Profile Picture Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-purple-600" />
                Profile Picture
              </h3>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.profilePicture ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept=".png,.jpeg,.jpg,.webp"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Validate image format
                        if (!validateImageFormat(file)) {
                          alert(
                            "Please upload only PNG, JPEG, JPG, or WebP image formats."
                          );
                          e.target.value = ""; // Clear the input
                          return;
                        }

                        // Validate image size
                        if (!validateImageSize(file)) {
                          alert("Image size should be less than 7MB.");
                          e.target.value = ""; // Clear the input
                          return;
                        }

                        try {
                          // Compress the image
                          const compressedFile = await compressImage(file);

                          // Convert compressed file to base64
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setFormData((prev) => ({
                              ...prev,
                              profilePicture: e.target?.result as string,
                            }));
                          };
                          reader.readAsDataURL(compressedFile);
                        } catch (error) {
                          console.error("Error processing image:", error);
                          alert("Error processing image. Please try again.");
                          e.target.value = ""; // Clear the input
                        }
                      }
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a profile picture (PNG, JPEG, JPG, WebP - max 7MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    data-error={!!formErrors.fullName}
                  />
                  {formErrors.fullName && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.jobTitle ? "border-red-500" : "border-gray-300"
                    }`}
                    data-error={!!formErrors.jobTitle}
                  />
                  {formErrors.jobTitle && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.jobTitle}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.company ? "border-red-500" : "border-gray-300"
                    }`}
                    data-error={!!formErrors.company}
                  />
                  {formErrors.company && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.company}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.website ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://yourwebsite.com"
                    data-error={!!formErrors.website}
                  />
                  {formErrors.website && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.website}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile URL <span style={{ color: "red" }}>*</span>
                  </label>

                  <div className="flex items-stretch">
                    <span
                      className={`inline-flex items-center px-3 text-sm border border-r-0 rounded-l-md bg-gray-50 text-gray-500 ${
                        formErrors.profileUrl
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      twintik.com/
                    </span>

                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={formData.profileUrl.replace("twintik.com/", "")}
                        onChange={(e) => {
                          handleInputChange(
                            "profileUrl",
                            `https://twintik.com/${e.target.value}`
                          );
                          setUsernameAvailable(null);
                          setSelectedSuggestion(null);
                          setUsernameCheckError(null);
                        }}
                        className={`w-full px-3 py-4 text-sm border rounded-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          formErrors.profileUrl
                            ? "border-red-500"
                            : "border-gray-300"
                        } ${usernameAvailable !== null ? "pr-10" : ""}`}
                        placeholder="yourusername"
                      />
                      {usernameAvailable === true && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-green-600 text-lg font-bold">
                            ✓
                          </span>
                        </div>
                      )}
                      {usernameAvailable === false && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-red-600 text-lg font-bold">
                            ✗
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleCheckUsername}
                      disabled={
                        checkingUsername ||
                        !formData.profileUrl.replace("twintik.com/", "").trim()
                      }
                      className="h-12 w-24 ml-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                    >
                      {checkingUsername ? "Checking..." : "Check"}
                    </button>
                  </div>

                  {/* Show check result */}
                  {usernameAvailable === true && (
                    <p className="text-green-600 text-xs mt-1 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      This URL is available!
                    </p>
                  )}
                  {usernameAvailable === false && usernameCheckError && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {usernameCheckError}
                    </p>
                  )}

                  {/* Suggestions */}
                  {usernameSuggestions.length > 0 && (
                    <div className="mt-2">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
                        <span className="text-xs text-gray-600 font-semibold block mb-2">
                          Suggestions:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {usernameSuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => handlePickSuggestion(suggestion)}
                              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors ${
                                selectedSuggestion === suggestion
                                  ? "bg-purple-600 text-white border-purple-600"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-purple-50"
                              }`}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {formErrors.profileUrl && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.profileUrl}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.bio ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Tell us about yourself..."
                    data-error={!!formErrors.bio}
                  />
                  {formErrors.bio && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                Contact Information
              </h3>

              {/* Email Section */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="Email address (pre-filled from invitation)"
                    disabled={true}
                    readOnly={true}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This email address was provided in your invitation and
                    cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Emails
                  </label>
                  <div className="space-y-2">
                    {formData.additionalEmails.map((email, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            const newEmails = [...formData.additionalEmails];
                            newEmails[index] = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              additionalEmails: newEmails,
                            }));
                          }}
                          className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            formErrors[`additionalEmails.${index}`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="sarah.j@example.com"
                          data-error={!!formErrors[`additionalEmails.${index}`]}
                        />
                        {formErrors[`additionalEmails.${index}`] && (
                          <p className="text-red-600 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {formErrors[`additionalEmails.${index}`]}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newEmails = formData.additionalEmails.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              additionalEmails: newEmails,
                            }));
                          }}
                          className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.additionalEmails.length < 3 && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            additionalEmails: [...prev.additionalEmails, ""],
                          }))
                        }
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add another email
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Phone Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <SafePhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="AE"
                    value={formData.phone}
                    onChange={(value) => handlePrimaryPhoneChange(value)}
                    placeholder="Enter phone number"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    data-error={!!formErrors.phone}
                  />
                  {formErrors.phone && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Phone Numbers
                  </label>
                  <div className="space-y-2">
                    {formData.additionalPhones.map((phone, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <SafePhoneInput
                            international
                            countryCallingCodeEditable={false}
                            defaultCountry="AE"
                            value={phone}
                            onChange={(value) =>
                              handleAdditionalPhoneChangeWithFormat(
                                index,
                                value
                              )
                            }
                            placeholder="Enter phone number"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                              formErrors[`additionalPhones.${index}`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            data-error={
                              !!formErrors[`additionalPhones.${index}`]
                            }
                          />
                          {formErrors[`additionalPhones.${index}`] && (
                            <p className="text-red-600 text-xs mt-1 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {formErrors[`additionalPhones.${index}`]}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAdditionalPhone(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors self-start mt-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.additionalPhones.length < 3 && (
                      <button
                        type="button"
                        onClick={addAdditionalPhone}
                        className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add another phone number
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) =>
                      handleAddressChange("street", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) =>
                      handleAddressChange("city", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) =>
                      handleAddressChange("state", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) =>
                      handleAddressChange("zipCode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <Select
                    options={countries}
                    value={
                      formData.address.country
                        ? countries.find(
                            (c) => c.label === formData.address.country
                          )
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleAddressChange(
                        "country",
                        selectedOption?.label || ""
                      )
                    }
                    placeholder="Select a country"
                    styles={selectStyles}
                    isSearchable={true}
                    isClearable={true}
                    className="w-full"
                    classNamePrefix="react-select"
                    formatOptionLabel={(option: any) => (
                      <div className="flex items-center">
                        <span className="mr-2">{option.flag}</span>
                        <span>{option.label}</span>
                      </div>
                    )}
                  />
                  {formErrors["address.country"] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors["address.country"]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-600" />
                Social Media Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) =>
                      handleSocialLinkChange("linkedin", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors["socialLinks.linkedin"]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="https://linkedin.com/in/yourprofile"
                    data-error={!!formErrors["socialLinks.linkedin"]}
                  />
                  {formErrors["socialLinks.linkedin"] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors["socialLinks.linkedin"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Twitter className="w-4 h-4 mr-2 text-blue-400" />X
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.x}
                    onChange={(e) =>
                      handleSocialLinkChange("x", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors["socialLinks.x"]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="https://x.com/yourhandle"
                    data-error={!!formErrors["socialLinks.x"]}
                  />
                  {formErrors["socialLinks.x"] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors["socialLinks.x"]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) =>
                      handleSocialLinkChange("instagram", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      formErrors["socialLinks.instagram"]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="https://instagram.com/yourhandle"
                    data-error={!!formErrors["socialLinks.instagram"]}
                  />
                  {formErrors["socialLinks.instagram"] && (
                    <p className="text-red-600 text-xs mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors["socialLinks.instagram"]}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Social Media Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-purple-600" />
                Custom Social Media Links
              </h3>
              <div className="space-y-3">
                {formData.customSocialLinks.map((link, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Platform Name
                        </label>
                        <input
                          type="text"
                          value={link.platform}
                          onChange={(e) => {
                            const newLinks = [...formData.customSocialLinks];
                            newLinks[index] = {
                              ...newLinks[index],
                              platform: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              customSocialLinks: newLinks,
                            }));
                          }}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            formErrors[`customSocialLinks.${index}.platform`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="e.g., TikTok, Snapchat, Medium"
                          data-error={
                            !!formErrors[`customSocialLinks.${index}.platform`]
                          }
                        />
                        {formErrors[`customSocialLinks.${index}.platform`] && (
                          <p className="text-red-600 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {formErrors[`customSocialLinks.${index}.platform`]}
                          </p>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Profile URL
                        </label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...formData.customSocialLinks];
                            newLinks[index] = {
                              ...newLinks[index],
                              url: e.target.value,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              customSocialLinks: newLinks,
                            }));
                          }}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                            formErrors[`customSocialLinks.${index}.url`]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="https://example.com/yourprofile"
                          data-error={
                            !!formErrors[`customSocialLinks.${index}.url`]
                          }
                        />
                        {formErrors[`customSocialLinks.${index}.url`] && (
                          <p className="text-red-600 text-xs mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {formErrors[`customSocialLinks.${index}.url`]}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            customSocialLinks: prev.customSocialLinks.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                        className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors mt-6"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      customSocialLinks: [
                        ...prev.customSocialLinks,
                        { platform: "", url: "" },
                      ],
                    }))
                  }
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add custom social media link
                </button>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    What happens next?
                  </h4>
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="mb-2">
                      Once you submit your profile, our team will:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Review your profile information</li>
                      <li>Configure your NFC card with your details</li>
                      <li>Set up your digital card for sharing</li>
                      <li>Send you a confirmation email with next steps</li>
                    </ul>
                    <p className="mt-3 text-blue-600 font-medium">
                      This process typically takes 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Submit Profile for Review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FFUserProfileSetup;
