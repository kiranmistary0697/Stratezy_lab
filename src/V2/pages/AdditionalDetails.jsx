import React from "react";
import Logo from "../assets/Logo.svg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { additionalDetailsData } from "../constants/AdditionalDetailsData";
import { Controller, useForm } from "react-hook-form";
import { submitAdditionalDetails } from "../services/api/authApi";
import { useAuth } from '../contexts/AuthContext.jsx';
import routes from "../constants/Routes.js";


const AdditionalDetails = () => {
    const navigate = useNavigate();
    const { handleSubmit, control, formState: { errors } } = useForm();
    const { authToken } = useAuth();

    const onSubmit = async (data) => {
        try {
            // Call the mock API to submit the data
            const response = await submitAdditionalDetails(data, authToken);

            if (!response.firstTimeLogin) {
                toast.success("Submission Successful")
                navigate(routes.termsgate);
            }
        } catch (error) {
            toast.error("Submission Failed")
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F3F6FC] font-inter mx-auto pt-[60px] lg:pt-[180px]">
            <div className="w-full flex justify-center">

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white py-[60px] px-[40px] h-auto w-full min-w-[350px] max-w-[470px]">
                    <div className="flex flex-col gap-y-[30px]">
                        <img src={Logo} alt="logo" className="w-20 lg:w-[5.75rem] h-auto" />
                        <h4 className="text-[20px] font-semibold leading-6 text-[#0A0A0A] mb-6">Almost there!</h4>
                    </div>

                    {Object.keys(additionalDetailsData).map((key) => {
                        const { question, options } = additionalDetailsData[key];

                        return (
                            <div key={key} className="flex flex-col gap-y-[10px] mb-5">
                                <label htmlFor={key} className="block text-[#0A0A0A] text-sm font-medium">
                                    {question}
                                </label>
                                <Controller
                                    name={key}
                                    control={control}
                                    rules={{ required: `${question} is required` }}
                                    render={({ field }) => (
                                        <div className="relative ">
                                            <select
                                                className="w-full h-[49px] px-4 py-2 pr-10 border-[1px] border-[#E0E1E4] rounded-md flex items-center justify-between cursor-pointer appearance-none focus:ring-2 focus:ring-[#3D69D3] focus:border-[#3D69D3] text-sm leading-5 text-[#666]"
                                                {...field}
                                                id={key}
                                            >
                                                <option className="text-sm leading-5 text-[#666]" value="">
                                                    Select
                                                </option>
                                                {options.map((option) => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                        className="px-4 py-2 text-sm leading-5 cursor-pointer hover:bg-[#F5F5F5]"
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <svg
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="17"
                                                height="17"
                                                viewBox="0 0 17 17"
                                                fill="none"
                                            >
                                                <path
                                                    d="M8.28101 11.0748L4.17011 6.96394C4.1134 6.90723 4.07107 6.846 4.04309 6.78022C4.01512 6.71445 4.00076 6.64338 4 6.56702C4 6.41582 4.05217 6.28351 4.1565 6.17011C4.26083 6.0567 4.39767 6 4.56702 6H13.1857C13.3559 6 13.4931 6.0567 13.5974 6.17011C13.7017 6.28351 13.7535 6.41582 13.7528 6.56702C13.7528 6.60482 13.6961 6.73713 13.5827 6.96394L9.47176 11.0748C9.37725 11.1693 9.28275 11.2355 9.18824 11.2733C9.09374 11.3111 8.98979 11.33 8.87638 11.33C8.76298 11.33 8.65903 11.3111 8.56452 11.2733C8.47002 11.2355 8.37551 11.1693 8.28101 11.0748Z"
                                                    fill="#666666"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                />
                                {errors[key] && (
                                    <span className="text-red-500 text-sm">This field is required</span>
                                )}
                            </div>
                        );
                    })}

                    <button
                        type="submit"
                        className="w-full bg-primary-blue text-white py-[15.5px] px-5 rounded-sm hover:bg-primary-blue-hover text-[14px] font-medium"
                    >
                        Get Started
                    </button>
                </form>
            </div>

            <footer className="mb-[50px] mt-[103px] font-inter">
                <div className="flex gap-x-[20px]">
                    <span className="text-sm font-normal text-[#666]">&copy; Orion</span>
                    <a
                        href={routes.privacyPolicy}
                        target="_blank"
                        className="text-sm font-normal text-[#666]"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href={routes.termsAndConditions}
                        target="_blank"
                        className="text-sm font-normal text-[#666]"
                    >
                        Terms & Conditions
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default AdditionalDetails;
