import React from 'react'
import { FaTwitter, FaLinkedin } from "react-icons/fa6";
import { FooterLinks } from '../../../constants/FooterData';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='min-h-footer bg-footer-dark text-primary-white'>
      <div className='max-w-maxContent mx-auto flex justify-between flex-wrap md:flex-nowrap gap-y-7 gap-x-7 px-5 md:px-[8.4375rem] py-[3.75rem] md:pt-20 md:pb-[5.6875rem]'>
        {/* Left container */}
        <div className='flex flex-col gap-y-[1.625rem] md:max-w-[23.1875rem]'>
          <p className='text-3xl font-montserrat'>Orion</p>

          <div className='flex gap-10'>
            <Link to='#'>
              <FaTwitter className='w-[1.625rem] h-[1.625rem] hover:text-[#1DA1F2]' />
            </Link>
            <Link to='#'>
              <FaLinkedin className='w-[1.625rem] h-[1.625rem] hover:text-[#0072b1]' />
            </Link>
          </div>

          <p className='leading-7'>
            We enable all classes of retail investors to trade smart by making trading strategy curation, backtesting and deployment super simple.
          </p>

          <span>&copy; 2025</span>
        </div>

        {/* Right Container */}
        <div className='flex flex-wrap gap-x-[3.75rem] gap-y-8 justify-between w-full lg:w-fit'>
          {
            FooterLinks.map((data, idx) => (
              <div key={`${data?.title}-${idx}`} className='flex flex-col gap-y-5'>
                <span className='text-lg'>
                  {data.title}
                </span>
                <ul className='flex flex-col gap-y-3'>
                  {
                    data.links.map((item, idx) => (
                      <li key={`${item?.title}-${idx}`}>
                        <Link to={item.link}>
                          {item.title}
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>
            ))
          }
        </div>
      </div>
    </footer>
  )
}

export default Footer
