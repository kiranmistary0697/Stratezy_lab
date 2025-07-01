import React from 'react';
import { HiCheck } from "react-icons/hi";

const Success = ({successMessage}) => {
    return (
        <div className="flex flex-col gap-y-1 items-center">
            <div className="h-[56px] w-[56px] rounded-full bg-primary-green flex items-center justify-center">
                <HiCheck className="w-full h-full text-white p-2" />
            </div>
            <br />
            <div className="text-center text-secondary text-xl leading-[24.2px]">
                Thank you for joining the waitlist.
                <br /><br />
                {successMessage}
            </div>
        </div>
    );
};

export default Success;
