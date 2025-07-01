import React from 'react';
const LeftSection = () => {
    return (
        <div className="lg:w-1/2 flex flex-col gap-y-[10px]">
            <h1 className="text-xl lg:text-2xl leading-[60px] font-semibold text-primary-blue font-lato">
                Request Access
            </h1>
            <h2 className="text-[#111111] font-semibold text-3xl lg:text-[45px] leading-[50px] lg:leading-[60px]">
                Unlock early access to Smart Trading
            </h2>
            <p className="text-secondary text-xl lg:text-2xl leading-[30px] lg:leading-[38px] mr-7">
                Join our waitlist and be among the first to experience a trading
                platform designed to empower every investor. From strategy creation to seamless execution, we’ve got you
                covered.
            </p>
        </div>
    );
};

export default LeftSection;
