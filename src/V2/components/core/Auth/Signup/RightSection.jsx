import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Success from "./Success";
import SignupForm from "./SignupForm";
import { joinWaitlist } from "../../../../services/api/authApi";
import { toast } from "react-toastify";

const RightSection = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        clearErrors,
    } = useForm({
        mode: "onTouched",
        reValidateMode: "onSubmit" // Re-validates only on submit after errors
    });

    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [recaptchaValue, setRecaptchaValue] = useState(null);

    const onSubmit = async (data) => {
        if (!recaptchaValue) {
            setError("recaptcha", { type: "manual", message: "You must complete the reCAPTCHA to proceed" });
            return;
        }
        clearErrors("recaptcha");

        try {
            const response = await joinWaitlist({ ...data, recaptchaValue });
            if (response.status === "Success") {
                setSuccessMessage(response.message);
                setIsSubmitSuccessful(true);
            } else {
                toast.error(response.message || "Submission failed");
            }
        } catch (error) {
            if (error.response)
                toast.error(error.response.data || "Something went wrong. Please try again.");
            else
                toast.error(error.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="lg:px-10 lg:py-[50px] lg:w-1/2 lg:bg-[#F3F6FC] rounded-md">
            {isSubmitSuccessful ? (
                <Success successMessage={successMessage} />
            ) : (
                <SignupForm
                    onSubmit={handleSubmit(onSubmit)}
                    register={register}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    setRecaptchaValue={setRecaptchaValue}
                    clearErrors={clearErrors}
                />
            )}
        </div>
    );
};

export default RightSection;