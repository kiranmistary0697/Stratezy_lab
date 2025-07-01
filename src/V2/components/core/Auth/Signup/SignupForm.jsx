import React from 'react'
import FormField from "../../../common/Form/FormField";
import ReCAPTCHA from 'react-google-recaptcha';
import Button from '../../../common/Button';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const SignupForm = ({ onSubmit, register, errors, isSubmitting, setRecaptchaValue, clearErrors }) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex gap-4">
                <FormField
                    id="firstName"
                    label="First Name *"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "First name is required",
                        pattern: {
                            value: /^[A-Za-z\s'-]+$/,
                            message: "First name must contain only letters, spaces, hyphens, or apostrophes",
                        },
                        minLength: {
                            value: 2,
                            message: "First name must be at least 2 characters long",
                        },
                    }}
                />
                <FormField
                    id="lastName"
                    label="Last Name *"
                    register={register}
                    errors={errors}
                    validation={{
                        required: "Last name is required",
                        pattern: {
                            value: /^[A-Za-z\s'-]+$/,
                            message: "Last name must contain only letters, spaces, hyphens, or apostrophes",
                        },
                        minLength: {
                            value: 2,
                            message: "Last name must be at least 2 characters long",
                        },
                    }}
                />
            </div>
            <FormField
                id="email"
                label="Email Address *"
                type="text"
                register={register}
                errors={errors}
                validation={{
                    required: "Email address is required",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter valid email address",
                    },
                }}
            />
            <FormField
                id="mobile"
                label="Mobile Number *"
                type="tel"
                register={register}
                errors={errors}
                validation={{
                    required: "Mobile number is required",
                    pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Mobile number must be exactly 10 digits",
                    },
                }}
            />
            <FormField
                id="referralCode"
                label="Referral Code"
                register={register}
                errors={errors}
                validation={{
                    maxLength: {
                        value: 10,
                        message: "Referral code cannot exceed 10 characters",
                    },
                }}
            />

            {/* ReCAPTCHA */}
            <div className="mt-4">
                <ReCAPTCHA
                    sitekey={siteKey}
                    onChange={(value) => {
                        setRecaptchaValue(value); // Update value
                        clearErrors("recaptcha"); // Clear errors dynamically
                    }}
                />
                {errors.recaptcha && (
                    <p className="text-red-500 text-sm mt-2">{errors.recaptcha.message}</p>
                )}
            </div>
            
            <Button type="submit"
                variant='filled'
                className={`w-full text-xl leading-[24.2px] font-semibold py-4 px-4 rounded-md ${isSubmitting && "opacity-50 cursor-not-allowed"
                    }`}
                disabled={isSubmitting} // Disable while submitting
            >
                Request Access
            </Button>
        </form>
    )
}

export default SignupForm
