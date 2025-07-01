import React from 'react'
import HeroImage from '../../../assets/HeroImage.png'
import Button from '../../common/Button'
import { useNavigate } from 'react-router-dom'
import routes from '../../../constants/Routes'
import { useAuth } from '../../../contexts/AuthContext'

const HeroSection = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className='grid lg:grid-cols-2 items-center max-w-maxContent mx-auto lg:px-[135px] lg:py-[150px] px-[20px] py-[60px] gap-x-[55px] gap-y-[24px]'>
            <div className='lg:max-w-[545px] flex flex-col items-start gap-y-[22px] lg:gap-y-[24px]'>
                <h1 className='text-primary text-[30px] lg:text-[45px] leading-[50px] lg:leading-[60px] font-semibold lg:pr-9'>
                    Discover Smart Trading with Orion
                </h1>
                <p className='text-secondary lg:text-[24px] text-[20px] leading-9'>
                    Your all-in-one platform for Strategies, Backtesting, and Deployment
                </p>

                {
                    !isAuthenticated &&
                    <div className='flex flex-wrap items-center gap-5 w-full'>
                        <Button variant='filled' className="w-full lg:hidden" onClick={() => navigate(routes.signup)}>
                            Get Started
                        </Button>
                        <Button variant='filled' className="hidden lg:block" onClick={() => navigate(routes.signup)}>
                            Request Access
                        </Button>
                        <Button className="w-full lg:w-fit" onClick={() => navigate(routes.signin)}>
                            Sign in
                        </Button>
                    </div>
                }
            </div>
            <div className="lg:max-w-[570px]"
            ><img src={HeroImage} alt='hero-image' className='w-full h-full object-cover' /></div>
        </div>
    )
}

export default HeroSection
