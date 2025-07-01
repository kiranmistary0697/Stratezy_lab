import React from 'react'

const RiskDisclosure = () => {

    const sectionStyling = 'flex flex-col md:gap-y-[35px] gap-y-[18px]'
    const headingStyling = 'text-primary md:text-[32px] md:leading-[31px] text-[24px] leading-[24px] font-semibold'
    const descriptionStyling = 'text-secondary md:leading-[33px] md:text-[20px] leading-[28px] text-[16px] font-light'
    const subHeadingStyling = 'md:text-[22px] md:leading-[22px] text-[16px] leading-[16px] font-medium text-secondary'

    return (
        <div className='max-w-maxContent flex flex-col items-center mx-auto md:gap-y-[22px] gap-y-[40px] lg:px-[135px] lg:py-[150px] px-[20px] md:py-[20px] py-[60px] font-inter'>
            <div><h1 className='md:text-[45px] md:leading-[60px] text-[35px] leading-[45px] font-semibold'>Risk Disclosure Statements</h1></div>
            <div className={sectionStyling}>

                <div className={sectionStyling}>
                    <p className={descriptionStyling}>We as Stratezy Labs Inc., do not provide auto trading services. Any use of third-party services or software on Stratezy Labs websites (
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
                        ) to avail additional functionality, may cause your Stratezy Labs platform to malfunction, alter expected outcomes and cause problems. As per our terms of use, we strongly suggest avoiding the usage of any third-party software or plugins along with Stratezy Labs Inc. platform (website and mobile applications). </p>
                    <p className={descriptionStyling}>ANY PERMUTATION OR COMBINATION OF THE OCCURRENCE OF THE POTENTIAL EVENTS THAT DEFINE THE RISKS DESCRIBED IN THIS DISCLOSURE STATEMENTS CAN LEAD TO A TOTAL OR PARTIAL LOSS OF OPERABILITY, RESPONSIVENESS, FUNCTIONALITY, AND FEATURES THAT COULD MATERIALLY AND ADVERSELY AFFECT YOUR USE OF&nbsp;
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
                        &nbsp;OR ANY PLATFORM OR DOMAIN SERVED BY US.</p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Risks of Using Internet-based Technology - General</h4>
                    <p className={`${descriptionStyling} pl-2`}>The Internet-related technological risks arising from using Stratezy Labs Inc.  Site and Services to write, test, analyze, and run trading strategies and related functions fall into three categories: (a) risks related to Stratezy Labs Inc. platform software; (b) risks related to computing and communications infrastructure used by Stratezy Labs Inc.; and (c) risks related to your software, hardware, and Internet connectivity. It is your obligation to thoroughly and appropriately test any trading strategies and related functionalities and verify the results before taking any position.</p>
                    <p className={subHeadingStyling}>a. Stratezy Labs Inc. software/code might fail to work properly.</p>
                    <p className={`${descriptionStyling} pl-2`}>i. All software is subject to inadvertent programming errors and bugs embedded in the code comprising that software. Any of these errors and bugs can cause the software in which they are located to fail or not work properly. The applications or software used to operate Stratezy Labs Inc. Site and Services are subject to this risk. Despite testing and ongoing monitoring and maintenance, inadvertent errors and bugs may still cause a failure in Stratezy Labs Inc’s applications software.</p>
                    <p className={`${descriptionStyling} pl-2`}>ii. We may update or revise our applications software in ways that cause some of its functionality or features to be lost or diminished. Any such loss or diminution could make Stratezy Labs Inc. less valuable to you, cause certain functions and features in your strategy workflows to fail, and require you to change your strategy settings.</p>
                    <p className={subHeadingStyling}>b. Stratezy Labs Inc. computing and communications infrastructure may fail.</p>
                    <p className={descriptionStyling}>The operation of Stratezy Labs Inc’s Site and Services depend heavily on cloud infrastructure of computing and communications systems. The operation of this infrastructure is subject to several risks:</p>
                    <p className={`${descriptionStyling} pl-2`}>i. Any or all the systems comprising our and cloud infrastructure could entirely or partially fail, function erratically, or function very slowly (thereby leading to latency, i.e., delays in receipt of and response to user requests).</p>
                    <p className={`${descriptionStyling} pl-2`}>ii. We may inadvertently cause a systems failure during planned or unplanned system maintenance.
                    </p>
                    <p className={`${descriptionStyling} pl-2`}>iii. We may undertake software upgrades, either planned or unplanned, that can take longer to implement or that can cause your computer system or Internet connectivity to fail.
                    </p>
                    <p className={`${descriptionStyling} pl-2`}>iv. We may change or remove functions and features whose change or removal causes your system to fail, function erratically, or function very slowly.
                    </p>
                    <p className={subHeadingStyling}>c. Your computer system, mobile app, and your Internet connectivity may fail.
                    </p>
                    <p className={descriptionStyling}>Any of the components of your computer system and/or your Internet connectivity could fail entirely, function erratically, or function very slowly. The result of any of these occurrences could make it difficult or impossible for you to access the Stratezy Labs Inc. Site or use the Stratezy Labs Inc. Services.
                    </p>
                    <p className={descriptionStyling}>You may incur losses (or fail to gain profits) while trading securities. You should discuss the risks of trading with the broker-dealer where you maintain an account or other investment professional. Stratezy Labs Inc. provides you only with trading technology and can provide no investment, financial, regulatory, tax, or legal advice.
                    </p>
                    <p className={`${descriptionStyling} pl-4`}>i. Your broker may experience failures in its infrastructure, fail to execute your orders in a correct or timely fashion, or reject your orders. Stratezy Labs Inc.  infrastructure through which you are placing manual orders to your broker might fail. In addition, even if Stratezy Lab Inc. infrastructure or your broker's infrastructure and API are working correctly, the orders may get rejected in error or by design, incorrectly execute orders, or induce errors through unexpected behavior (such as returning messages out of sequence, incorrectly acknowledging orders, or posting incorrect execution reports). If at all, any losses arise from these risks, Stratezy Labs Inc. bears no responsibility for this.
                    </p>
                    <p className={`${descriptionStyling} pl-4`}>ii. The system you use for generating trading orders, communicating those orders to your broker, and receiving queries and trading results from your broker may fail or not function in a correct or timely manner.
                    </p>
                    <p className={`${descriptionStyling} pl-4`}>Latency (i.e., delays) within and between your system, as well as those of your broker and the market in which you seek to affect trades, might cause orders, corrections, and cancels to be placed or not placed in ways that are not desired. You may receive incorrect information, or be unable to get information, about your orders, your positions, or market conditions. Incorrect actions may be taken, or correct actions may not be taken, because of inaccurate or missing information.
                    </p>
                    <p className={`${descriptionStyling} pl-4`}>iii. Malicious and criminal activities might cause your scanners to fail or your brokerage account to be compromised
                    </p>
                    <p className={`${descriptionStyling} pl-4`}>All computers and networks are subject to malicious “hacking” attacks and criminal activities designed to misappropriate intellectual property, compromise personally identifiable information, steal funds, or any combination of such purposes. These attacks might be attacks on a target of opportunity or specifically targeted. Any such attack could cause the system to function improperly or not at all and could result in the misappropriation of your intellectual property, the compromise of your personally identifiable information and personal financial information, the theft of your funds and can cause your strategy to misbehave, malfunction or behave erratically.
                    </p>
                    <p className={`${descriptionStyling} pl-4`}>iv: Deployed profiles may or may not include securities that are no longer actively traded or relevant.
                    </p>
                </div>

                <div className={sectionStyling}>
                    <h4 className={headingStyling}>DISCLAIMERS</h4>
                    <p className={subHeadingStyling}>Browser Notification</p>
                    <p className={descriptionStyling}>The first time you login to the www.stratezylabs.ai and www.stratezylabs.com  websites, the web browser asks your permission to allow browser notifications. Please allow the notification, or else you won't be getting any alerts on your system when certain notification conditions are met.
                        Discover Strategies</p>
                    <p className={subHeadingStyling}>Discover Strategies</p>
                    <p className={descriptionStyling}>Users can check various provided library functions provided on the Site to understand the working of indicators and how to use them. Stratezy Labs is not responsible for any profits/losses occurring after placing manual orders based on deployed strategies in the market.
                    </p>
                    <p className={subHeadingStyling}>Notification Alerts</p>
                    <p className={descriptionStyling}>Once a trading strategy is deployed and is live, system may generate alerts to the users. Our systems attempt to deliver the alert to the user over the internet. By using this service, the user acknowledges they understand that the alerts' delivery is dependent on many factors such as the internet connection of the user, location, time of the day, server load, data availability etc.
                    </p>
                    <p className={descriptionStyling}>We recommend users to be logged in to Stratezy Lab Inc.’s Site and keep it open in their browser and maintain a fast uninterrupted internet connection to their devices to see the best alerts delivery.
                        Stratezy Labs relies on third-party services for market data eg. for ticks, OHLCV etc.  If these services are down due to unforeseen circumstances or experience a downtime due to various technical/nontechnical issues, Stratezy Labs might not be able to generate and deliver the actionable alerts on time or at all. Market prices, data, and other information available through Stratezy Labs are not warranted as to completeness or accuracy and are subject to change without notice. System response and account access times may vary due to a variety of factors, including trading volumes, market conditions, system performance, and other factors.
                    </p>
                    <p className={descriptionStyling}>Once a signal is generated, we try to send this signal to the user's device over the internet. The delivery of these alerts are subject to the network conditions of the user, internet services and technical issues.
                    </p>
                    <p className={descriptionStyling}>Our service providers or systems that provide data could experience failures, errors, lag, and latency which could result in missing, incorrect, or stale market data leading to no/wrong signals(alert) while triggering an alert.
                    </p>
                    <p className={descriptionStyling}>All actionable order alerts are read-only alerts which may or may not be market order alerts, where with a single click the user can send the order to the exchange. If on any scrip / instruments such as Stock, there is high volatility due to news based or non-news based or any speculative events / positions, Stratezy Labs is not responsible for higher slippages. You understand that volatility is the nature of the market. Upon clicking on buy/sell on the order window, based on the user's network speed, a network latency can be experienced and any rapid clicks on the buy/sell button through the same or different windows can lead to multiple order placements. Users take full responsibility for making sure the actions on the notifications are their own actions and are fully aware of their positions while clicking on the buy/sell button.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RiskDisclosure
