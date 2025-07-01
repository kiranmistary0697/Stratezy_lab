import React from 'react'
import Button from '../../common/Button'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const ProductSection = ({ data, index }) => {
  const isEvenIndex = index % 2 === 0;

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const renderHeading = () => (
    <>
      <h2 className={`text-primary text-[30px] lg:text-[38px] leading-[50px] font-semibold ${data.mobileHeading && 'hidden lg:block'}`}>
        {data.heading}
      </h2>
      {data.mobileHeading && (
        <h2 className="text-primary text-[30px] lg:text-[38px] leading-[50px] font-semibold lg:hidden">
          {data.mobileHeading}
        </h2>
      )}
    </>
  );

  return (
    <div className={`${isEvenIndex ? 'bg-[rgba(61,105,211,0.06)]' : ''}`}>
      <div className="grid lg:grid-cols-2 items-center max-w-maxContent mx-auto lg:px-[135px] lg:py-[80px] px-[20px] py-[60px] gap-x-[30px] gap-y-[20px]">

        {/* Left section */}
        <div className={`lg:max-w-[570px] flex flex-col items-start gap-y-[20px] lg:mr-[25px] ${!isEvenIndex && 'lg:order-1'}`}>
          <div>
            <p className="text-primary-blue text-[20px] lg:text-[24px] leading-[30px] lg:leading-[60px] font-semibold font-lato">
              {data.subHeading}
            </p>
            {renderHeading()}
          </div>

          <p className="lg:hidden text-secondary text-xl lg:text-2xl leading-7 lg:leading-[33.6px]">
            {data.description}
          </p>

          <ul className="list-disc text-secondary text-xl lg:text-2xl leading-7 lg:leading-[33.6px] ml-[1em] lg:mr-[2.375rem]">
            {data.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          {
            !isAuthenticated &&
            <div className="hidden lg:flex items-center gap-x-5">
              <Button
                variant={data.button.variant}
                onClick={() => data.button.onClick(navigate)}
              >
                {data.button.text}
              </Button>
            </div>
          }
        </div>

        {/* Right section - image */}
        <div className="lg:max-w-[570px]">
          <img
            src={data.image}
            alt="hero-image"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductSection
