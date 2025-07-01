import React from 'react';
import Button from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import routes from '../../../constants/Routes';
import { useAuth } from '../../../contexts/AuthContext';

const WhyOrionSection = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <section className="max-w-maxContent flex flex-col items-center mx-auto px-5 md:px-[159px] py-[60px] md:py-[120px] text-center gap-y-[1.875rem]">
            <h3 className="text-primary text-3xl md:text-[2.5rem] font-semibold leading-[50px] md:leading-[60px]">
                Why Orion?
            </h3>
            <div className="max-w-[960px] flex flex-col gap-y-[0.625rem] text-secondary md:text-[1.75rem] mx-[11px] md:mx-0">
                <p className="hidden md:block text-xl md:text-[1.75rem] md:leading-[39.2px] md:mx-7">
                    Whether you are a beginner exploring leveraging pre-built building blocks,
                    a DIY enthusiast crafting custom strategies, or a professional seeking expert guidance,
                    Orion has a solution for you.
                </p>
                <p className="block md:hidden text-xl md:text-[1.75rem] md:leading-[39.2px] mx-2">
                    Orion is for the dreamers, the learners, and the doers. We designed our platform
                    to meet you where you are on your trading journey - with a friendly, intuitive experience
                    that grows with you. Because the art of investing belongs to everyone.
                </p>
                <p className="underline underline-offset-4 text-xl md:text-[1.75rem] leading-7 md:leading-[39.2px] md:italic mx-2 md:mx-0">
                    Orion supports only end-of-day trades and cash market transactions, with no support for F&O or derivatives.
                </p>
                <span className="leading-[44px] md:font-medium text-xl md:text-[1.75rem]">
                    Start Trading Smarter Today.
                </span>
            </div>
            {
                !isAuthenticated &&
                <Button variant="filled" className="w-full md:w-fit" onClick={() => navigate(routes.signup)}>
                    Request Access
                </Button>
            }
        </section>
    );
};

export default WhyOrionSection;
