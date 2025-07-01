import React from "react";
import LeftSection from "../components/core/Auth/Signup/LeftSection";
import RightSection from "../components/core/Auth/Signup/RightSection";

const Signup = () => {
    return (
        <div className="flex justify-center items-center py-[60px] lg:py-[150px] px-5 lg:px-[135px] max-w-maxContent mx-auto">
            <div className="flex flex-col lg:flex-row rounded-lg overflow-hidden gap-y-[31px] gap-x-[30px]">
                <LeftSection />
                <RightSection />
            </div>
        </div>
    );
};

export default Signup;
