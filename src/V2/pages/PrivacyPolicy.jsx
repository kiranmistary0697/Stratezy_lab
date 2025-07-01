import React from 'react'

const PrivacyPolicy = () => {

    const sectionStyling = 'flex flex-col md:gap-y-[35px] gap-y-[18px]'
    const headingStyling = 'text-primary md:text-[32px] md:leading-[31px] text-[24px] leading-[24px] font-semibold'
    const descriptionStyling = 'text-secondary md:leading-[33px] md:text-[20px] leading-[28px] text-[16px] font-light'
    const subHeadingStyling = 'md:text-[28px] md:leading-[29px] text-[22px] leading-[22px] font-semibold mb-4'

    return (
        <div className='max-w-maxContent flex flex-col items-center mx-auto md:gap-y-[22px] gap-y-[40px] lg:px-[135px] lg:py-[150px] px-[20px] md:py-[20px] py-[60px] font-inter'>
            <div><h1 className='md:text-[45px] md:leading-[60px] text-[35px] leading-[45px] font-semibold'>Privacy Policy</h1></div>
            <div className={sectionStyling}>

                <div className={sectionStyling}>
                    <p className={descriptionStyling}>Stratezy Labs, Inc. (
                        <a
                            style={{ textDecoration: "underline", color: "blue" }}
                            href="https://www.stratezylabs.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.stratezylabs.ai
                        </a>
                        &nbsp;,&nbsp;
                        <a
                            style={{ textDecoration: "underline", color: "blue" }}
                            href="https://www.stratezylabs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.stratezylabs.com
                        </a>
                        ) is strongly committed to protecting the privacy of its customers and has taken all necessary and reasonable measures to protect the confidentiality of the customer information and its transmission through the world wide web and it shall not be held liable for disclosure of the confidential information when in accordance with this Privacy Commitment or in terms of the agreements, if any, with the Customers.</p>
                    <p className={descriptionStyling}>Stratezy Labs, Inc. endeavors to safeguard and ensure the security of the information provided by the Customer. Stratezy Labs, Inc. uses 256-bit encryption, for the transmission of the information, which is currently the permitted level of encryption in India.</p>
                    <p className={descriptionStyling}>While using&nbsp;
                        <a style={{ textDecoration: "underline", color: "blue" }} href="https://www.stratezylabs.ai" target="_blank" rel="noopener noreferrer">www.stratezylabs.ai</a>
                        &nbsp;and&nbsp;
                        <a style={{ textDecoration: "underline", color: "blue" }} href="https://www.stratezylabs.com" target="_blank" rel="noopener noreferrer">www.stratezylabs.com</a>
                        &nbsp;availing the products and services of Stratezy Labs, Inc. or partnered brokers, Stratezy Labs, Inc. and its Affiliates may become privy to the personal information of its customers, including information that is of a confidential nature.</p>
                    <p className={descriptionStyling}>The Customer would be required to cooperate with Stratezy Labs, Inc. to ensure the security of the information, and it is recommended that the Customers necessarily choose their passwords carefully such that no unauthorized access is made by a third party. To make the password complex and difficult for others to guess, the Customers should use combination of alphabets, numbers and special characters (like !, @, #, $ etc.). The Customers should undertake not to disclose their password to anyone or keep any written or other record of the password such that a third party could access it. Stratezy Labs, Inc. undertakes not to disclose the information provided by the Customers to any person, unless such action is necessary to: Conform to legal requirements or comply with legal process; Protect and defend Stratezy Labs, Inc. or its Affiliates' rights, interests or property; Enforce the terms and conditions of the products or services; or Act to protect the interests of Stratezy Labs, Inc., its Affiliates, or its members, constituents or of other persons.</p>
                    <p className={descriptionStyling}>The Customers shall not disclose to any other person, in any manner whatsoever, any information relating to Stratezy Labs, Inc. or its Affiliates of a confidential nature obtained while availing the services through the website. Failure to comply with this obligation shall be deemed a serious breach of the terms herein and shall entitle Stratezy Labs, Inc. or its Affiliates to terminate the services, without prejudice to any damages, to which the customer may be entitled otherwise.</p>
                    <p className={descriptionStyling}>Stratezy Labs, Inc. will limit the collection and use of customer information only on a need-to-know basis to deliver better service to the customers. Stratezy Labs, Inc. may use and share the information provided by the Customers with its Affiliates and third parties for providing services and any service-related activities such as collecting subscription fees for such services, and notifying or contacting the Customers regarding any problem with, or the expiration of, such services. In this regard, it may be necessary to disclose the customer information to one or more agents and contractors of Stratezy Labs, Inc. and their sub-contractors, but such agents, contractors, and sub-contractors will be required to agree to use the information obtained from Stratezy Labs, Inc. only for these purposes.</p>
                    <p className={descriptionStyling}>The Customer authorizes Stratezy Labs, Inc. to exchange, share, part with all information related to the details and transaction history of the Customers to its Affiliates / banks / financial institutions / credit bureaus / agencies/participation in any telecommunication or electronic clearing network as may be required by law, customary practice, credit reporting, statistical analysis and credit scoring, verification or risk management and shall not hold Stratezy Labs, Inc. liable for use or disclosure of this information.</p>
                    <p className={descriptionStyling}>BY REGISTERING FOR OR USING THE SITE&nbsp;
                        <a style={{ textDecoration: "underline", color: "blue" }} href="https://www.stratezylabs.ai" target="_blank" rel="noopener noreferrer">www.stratezylabs.ai</a>
                        &nbsp;and&nbsp;
                        <a style={{ textDecoration: "underline", color: "blue" }} href="https://www.stratezylabs.com" target="_blank" rel="noopener noreferrer">www.stratezylabs.com</a>
                        &nbsp;OR ANY PLATFORM OR DOMAIN SERVED BY US, YOU SIGNIFY YOUR ACCEPTANCE OF THIS PRIVACY STATEMENT. IF YOU DO NOT AGREE TO THIS PRIVACY STATEMENT, YOU CANNOT USE THE SITE. We reserve the right to modify this Statement at any time by posting a notice on the Site’s home page. (If we consider it appropriate, we may also provide additional notice of significant changes). Your use of the Site after the date of the last modification indicates to us that you agree to the changes.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Servers and transfer of information</h4>
                    <p className={descriptionStyling}>The Site is hosted by servers owned by THIRD PARTY vendors if you are in or outside of India, your Personal Information will be transferred to our servers and by submitting your Personal Information, you consent to its transfer to India and to its storage, processing, and use there in accordance with this Privacy Statement.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Use of Cookies</h4>
                    <div className='text-secondary'>
                        <p className={descriptionStyling}>A cookie is a small data file, often including an anonymous unique identifier that is sent from a website’s computer and stored on your computer’s hard drive. Use of cookies is common on the Internet. A web site can send its own cookie to your browser if your browser’s preferences allow it, but (to protect your privacy) your browser permits a web site to access only the cookies it has already sent to you, not the cookies sent to you by other sites. You can configure your browser to accept all cookies, reject all cookies, or notify you when a cookie is sent. (Each browser is different, so check the “Help” menu of your browser to learn how to change your cookie preferences.) You can reset your browser to refuse all cookies or indicate when a cookie is being sent. But if you refuse cookies, some parts of the Site will not function properly and may not provide services or information you have requested. For example, without cookies, we will not be able to provide you with searches that you have asked us to save.</p>
                        <p className={descriptionStyling}>Our hosting services maintains its systems in accordance with reasonable industry standards to reasonably secure the information of its customers, such as using SSL encryption in certain places to prevent eavesdropping, and employing up-to-date software on the server. However, no data transmission over the Internet can be guaranteed to be 100% secure. “Perfect security” does not exist on the Internet, and you use the Site at your own risk.</p>
                    </div>

                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Cookies Policy</h4>
                    <p className={descriptionStyling}>The use of this website is governed by the general terms of usage of websites. In addition, Stratezy Labs, Inc. retains all proprietary rights over the intellectual property and information made available to the user through this website.</p>
                    <p className={descriptionStyling}>Stratezy Labs, Inc. recognizes all copyrights associated with its products and services. However, Stratezy Labs, Inc. does not warrant the accuracy, completeness or reliability of the information or content contained herein and made available to the user; nor will Stratezy Labs, Inc. be made liable for any losses incurred or investments made or other decisions taken/not taken based on the representations made or information provided hereunder.</p>
                    <p className={descriptionStyling}>Most browsers have an option for turning off the cookie feature, which will prevent your browser from accepting new cookies, as well as (depending on the sophistication of your browser software) allowing you to decide on acceptance of each new cookie in a variety of ways. We strongly recommend that you leave cookies active for the session on&nbsp;
                        <a style={{ textDecoration: "underline", color: "blue" }} href="https://www.stratezylabs.ai" target="_blank" rel="noopener noreferrer">www.stratezylabs.ai</a>
                        &nbsp;and&nbsp;
                        <a style={{ textDecoration: "underline", color: "blue" }} href="https://www.stratezylabs.com" target="_blank" rel="noopener noreferrer">www.stratezylabs.com</a>
                        &nbsp;because they enable you to take advantage of the most attractive features of our Services.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Notifications / Alerts</h4>
                    <p className={descriptionStyling}>Push and locally scheduled notifications can provide people with timely information and provide them with the ability to take appropriate actions in response.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Email Communications</h4>
                    <p className={descriptionStyling}>We may receive confirmation when you open an account from us or open an email from us. We use this confirmation to improve our customer service and keep you informed of new services, changes, and offerings.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Aggregate Information</h4>
                    <p className={descriptionStyling}>We collect statistical information about how both unregistered and registered users, collectively, use the Services ("Aggregate Information"). Some of this information is derived from Personal Information. This statistical information is not Personal Information and cannot be tied back to you, your Account, or your web browser.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>IP Address Information</h4>
                    <p className={descriptionStyling}>While we collect and store IP address information, that information is not made public. We do at times, however, share this information with our partners, service providers and other persons with whom we conduct business, and as otherwise specified in this Privacy Policy.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Information required by our app</h4>
                    <p className={descriptionStyling}>n order to ensure proper functionality of our product on the mobile platform, the mobile application that you download from App Stores such as Google Play Store requires you to grant certain permissions for your device. This is to ensure a smooth and seamless mobile experience on your devices and these permissions may vary for different devices and OS models/versions. </p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Email Communications with Us</h4>
                    <p className={descriptionStyling}>As part of the Services, you may occasionally receive email and other communications from us, such as communications relating to your Account or new features or promotional activities related to our products.
                        Information Shared with Our Agents
                        We employ and contract with people and other entities that perform certain tasks on our behalf and who are under our control (our "Agents"). We may need to share Personal Information with our Agents to provide products or services to you. Unless we tell you differently, our Agents do not have any right to use Personal Information or other information we share with them beyond what is necessary to assist us. You hereby consent to our sharing of Personal Information with our Agents.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Information Disclosed Pursuant to Business Transfers</h4>
                    <p className={descriptionStyling}>In some cases, we may choose to buy or sell assets. In these types of transactions, user information is typically one of the transferred business assets. Moreover, if we, or substantially all our assets, were acquired, or if we go out of business or enter bankruptcy, user information would be one of the assets that is transferred or acquired by a third party. You acknowledge that such transfers may occur, and that any acquirer of us or our assets may continue to use your Personal Information as set forth in this policy.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Information Disclosed for Our Protection and the Protection of Others</h4>
                    <p className={descriptionStyling}>We also reserve the right to access, read, preserve, and disclose any information as it reasonably believes is necessary to (i) satisfy any applicable law, regulation, legal process or governmental request, (ii) enforce the Terms of Service, including investigation of potential violations thereof, (iii) detect, prevent, or otherwise address fraud, security or technical issues, (iv) respond to user support requests, or (v) protect our rights, property or safety, our users and the public. This includes exchanging information with other companies and organizations for fraud protection and spam/malware prevention.</p>
                </div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
