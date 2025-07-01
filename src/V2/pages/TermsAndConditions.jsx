import React from 'react'

const TermsAndCondtions = () => {

    const sectionStyling = 'flex flex-col md:gap-y-[35px] gap-y-[18px]'
    const headingStyling = 'text-primary md:text-[32px] md:leading-[31px] text-[24px] leading-[24px] font-semibold'
    const descriptionStyling = 'text-secondary md:leading-[33px] md:text-[20px] leading-[28px] text-[16px] font-light'
    const subHeadingStyling = 'md:text-[28px] md:leading-[29px] text-[22px] leading-[22px] font-semibold mb-4'

    return (
        <div className='max-w-maxContent flex flex-col items-center mx-auto md:gap-y-[22px] gap-y-[40px] lg:px-[135px] lg:py-[150px] px-[20px] md:py-[20px] py-[60px] font-inter'>
            <div><h1 className='md:text-[45px] md:leading-[60px] text-[35px] leading-[45px] font-semibold'>Terms and Conditions</h1></div>
            <div className={sectionStyling}>

                <div className={sectionStyling}>
                    <p className={descriptionStyling}>Kindly read the following Terms of Use carefully. By using the Stratezylabs.ai and Stratezylabs.com websites or associated mobile apps and/or any related services accessed through the Stratezy Labs platform, you acknowledge that you have read, understood, and agreed to all the terms and conditions set forth below. These terms should be read and agreed upon along with our Privacy Policy.</p>
                    <p className={descriptionStyling}>
                        Welcome to &nbsp;
                        <a
                            style={{ textDecoration: "underline", color: "blue" }}
                            href="https://www.stratezylabs.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.stratezylabs.ai
                        </a>
                        &nbsp; and &nbsp;
                        <a
                            style={{ textDecoration: "underline", color: "blue" }}
                            href="https://www.stratezylabs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.stratezylabs.com
                        </a>
                    </p>
                    <p className={descriptionStyling}>These terms of use (“Terms of Use”) provide the terms and conditions on which users (“You” or “Yourself” or “User”) access, register and subscribe on the websites stratezylabs.ai and/or stratezylabs.com and its sub-domains owned/managed and/or associated mobile application (collectively referred to as “the Platform”) owned and operated by STRATEZY LABS, INC. (“Company” or “Us” or “We”) to avail the Services (defined below). Please note that the Privacy Policy is an integral part of the Terms of Use and should be read together. </p>
                    <p className={descriptionStyling}><b>NOTE:</b> We do NOT provide or promote in any way AUTO TRADING (automatic order placement) for any securities, derivatives(futures/options), or in any markets. We only provide notifications/alerts based on your requirements for the Securities Market alone, and the orders need to be manually triggered by the user. “Strategy” or “Strategic/Smart trading” on Stratezy Labs, its sub-domains and/or the mobile application or any platform being managed by us does NOT mean, imply, or refer to auto/algo trading, and Strategic/Smart trading ONLY refers to deriving the trade signal based on a strategy/set of rules/steps and/or strategy, but the order placement post identification of a trade signal needs to be explicitly done by the user.</p>
                </div>

                {/* AGREEMENT/TERMS OF USE */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>AGREEMENT/TERMS OF USE</h4>
                    <p className={descriptionStyling}>These Terms of Use constitute a legally binding agreement between Stratezy Labs, Inc. provider of stratezylabs.ai and stratezylabs.com, "us" or "we" and you (“you”), the individual logging in with their email, sets forth the terms and conditions that govern your use of stratezylabs.ai and stratezylabs.com (the "Site" or “ Mobile App” Together referred as Platform) and/or any related services (the "Services") accessed through the Stratezy Labs platform.</p>
                    <p className={descriptionStyling}>We refer to these Terms of Use as the “Agreement.” We may update or amend these Terms of Use from time to time by posting such updates or amendments to the Site. Your use of the Site after we post any such updates or amendments will constitute your agreement to those updates or amendments.</p>
                    <p className={descriptionStyling}>THIS AGREEMENT REQUIRES THE USE OF ARBITRATION ON AN INDIVIDUAL BASIS TO RESOLVE DISPUTES, RATHER THAN JURY TRIALS OR className ACTIONS, AND ALSO LIMITS THE REMEDIES AVAILABLE TO YOU IN THE EVENT OF A DISPUTE.</p>
                    <p className={descriptionStyling}>PLEASE CAREFULLY READ THESE TERMS OF USE BEFORE ACCESSING THE SITE OR USING ANY OF THE SERVICES. IF YOU DO NOT WISH TO BE BOUND BY THESE TERMS AND CONDITIONS OR IF YOU CANNOT REMAIN IN COMPLIANCE WITH SUCH TERMS AND CONDITIONS, YOU MAY NOT ACCESS THE SITE OR USE ANY OF THE SERVICES AND SHOULD IMMEDIATELY CEASE SUCH ACCESS AND USE.</p>
                </div>

                {/* Use of Services */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Use of Services</h4>
                    <div className='text-secondary'>
                        <p className={descriptionStyling}>Unless otherwise specified, Stratezy Labs, Inc. grants to you a non-exclusive and non-transferable limited right and license to access the Site stratezylabs.ai, stratezylabs.com or associated mobile apps. The users of this platform, for trading need to have opened a trading and demat account in any of the Broker(s) enabled on the platform. The Services provided on this platform is for your personal use only, if you agree with and comply fully with the provisions of this Agreement. The complete customer facing features of the Site are available only by paying a premium depending on the plans available.</p>
                        <p className={descriptionStyling}>You acknowledge and understand that we provide tools and infrastructure designed to allow you to discover, create, backtest, and deploy your strategies and strategic/smart trading strategies live in the market</p>
                        <p className={descriptionStyling}>To be clear, we do not provide any trading strategy or trading strategies, rather the tools to create them and the data with which you can test and use them. You can create your own strategies or use strategies made available on the Site to modify them as per your needs.</p>
                        <p className={descriptionStyling}>Stratezy Labs is not promoting any stock or indicator, this is just a sample which user on his/her own accord is responsible if used and which results in any profits/losses occurred after deploying discover strategies in the market.</p>
                    </div>

                </div>

                {/* Accounts, Passwords and Security */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Accounts, Passwords and Security</h4>
                    <p className={descriptionStyling}>To become a registered user, you can sign-up on the Site and then use your login to access the Site. We are eligible to know your current, complete, and accurate personal identifiable information, including, without limitation, your real name, and the email address through which we can correspond with you and the telephone number, as prompted by the applicable registration form. You further agree to keep any registration information you provide to Stratezy Labs current, complete and accurate.</p>
                    <p className={descriptionStyling}>FURTHERMORE, YOU ARE ENTIRELY RESPONSIBLE FOR ANY AND ALL ACTIVITIES AND CONDUCT, WHETHER BY YOU OR ANYONE ELSE, THAT ARE CONDUCTED THROUGH YOUR ACCOUNT. We may hold you liable for any losses incurred by Stratezy Labs, Inc. or any other party due to someone else’s use of your account or password. You agree to notify Stratezy Labs, Inc. by writing to support@stratezylabs.com immediately upon your becoming aware of any unauthorized use of your account or any other breach of security involving your account. Stratezy Labs, Inc. will not be liable for any loss that you or any other party may incur because of someone else’s use of your password or account, either with or without your knowledge.</p>
                </div>

                {/* Prohibited Activities */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Prohibited Activities</h4>
                    <p className={descriptionStyling}>We use the term “Content” to mean entire or partial strategies, trading strategies, data transformations, data analysis and manipulation functions, tools, software, data, databases, text, messages, images, graphics, video files, audio files, ideas or any other information and materials. We use the term “Shared Content” to mean the Content (other than third party data) that we, you, or other Registered Users of Stratezy Labs, Inc. post in publicly accessible areas of the Site and Services. Third party data is subject to the terms and conditions of the provider of such data. Other than as provided at the end of this Section in respect of Shared Content, you acknowledge and agree that you will NOT:</p>
                    <p className={descriptionStyling}>i. Copy, modify, publish, transmit, distribute, transfer or sell, create derivative works of, or in any way exploit, any of the Content accessible through the Site not submitted or provided by you, including by use of any robot, spider, scraper, scripting, deep link or other similar automated data gathering or extraction tools, program, strategic/smart or methodology, unless you obtain Stratezy Labs, Inc.’s prior written consent; use the Site or Services to advertise, market, sell, or otherwise promote any commercial enterprise that you own, are employed by or are otherwise compensated by, either directly or indirectly; use any engine, software, tool, agent or other device or mechanism to navigate or search the Site, other than the search engines and agents available through the Service and other than generally available third party web browsers; copy, reverse engineer, reverse assemble, otherwise attempt to discover the source code, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer or sell any information, software, products or services obtained through the Site or the Services; access the Site or use the Services by any means other than through Stratezy Labs, Inc.-provided or approved interfaces; transmit any Content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, or otherwise objectionable or which may invade another's right of privacy or publicity;</p>
                    <p className={descriptionStyling}>ii. post or transmit any material that contains a virus, worm, Trojan horse, or any other contaminating or destructive feature; post or transmit information protected under any law, agreement or fiduciary relationship, including but not limited to proprietary or confidential information of others; use any of the Site’s or Service's communications features in a manner that adversely affects the availability of its resources to other users; post or transmit any unsolicited advertising, promotional materials, "junk mail", "spam," "chain letters," "pyramid schemes" or any other form of solicitation or any non-resumé information such as opinions or notices, commercial or otherwise; access or use the Site or Services to intentionally or unintentionally violate any applicable local, state, national or international law, including, but not limited to, regulations promulgated under any such law; upload or transmit any material that infringes, violates or misappropriate any patent, trademark, service mark, trade secret, copyright or other proprietary rights of any third party or violates a third party’s right of privacy or publicity; manipulate or otherwise display or obstruct portions of the Site and/or the Services by using framing or similar navigational technology; register, subscribe, attempt to register, attempt to subscribe, unsubscribe, or attempt to unsubscribe, any party for any Stratezy Labs, Inc. product or Service if you are not expressly authorized by such party to do so;</p>
                    <p className={descriptionStyling}>iii. use the Site and/or the Services for any purpose that is unlawful or prohibited by these terms and conditions; use the Site or the Services in any manner that could damage, disable, overburden or impair Stratezy Labs, Inc.’s servers or networks, or interfere with any other user's use and enjoyment of the Site and/or the Services; attempt to gain unauthorized access to any of the Site, Services, accounts, computer systems or networks connected to Stratezy Labs, Inc. through hacking, password mining, brute force or any other means; obtain or attempt to obtain any Content through any means not intentionally made available as Shared Content through the Site or the Services; or knowingly provide any Content that is false or inaccurate or will become false or inaccurate at any time.</p>
                    <p className={descriptionStyling}>iv. use of any third-party services/software/mechanisms/tool/plugins/code injections on Stratezy Labs website/app or any other Stratezy Labs services.</p>
                </div>

                {/* Investment Disclaimer */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Investment Disclaimer</h4>
                    <p className={descriptionStyling}>You agree to indemnify, defend, and hold harmless Orion, its officers, directors, employees, and agents, from and against any and all claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees and costs, arising out of or in any way connected with (i) your access to or use of our Services; (ii) your violation of these Terms; (iii) your violation of any third party right, including without limitation any intellectual property right or privacy right; or (iv) any claim that your content caused damage to a third party..</p>
                </div>

                {/* Modifications to Services */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Modifications to Services</h4>
                    <p className={descriptionStyling}>You acknowledge and understand that the Services of Stratezy Labs, Inc. (Stratezy Labs Platform) are not intended to supply investment, financial, tax or legal advice. The Services are not investment advice and any observations concerning any security, trading strategy or investment strategy provided in the Services is not a recommendation to buy, sell or hold such investment or security or to make any other investment decisions. We offer no advice regarding the nature, potential value, risk or suitability of any particular investment strategy, trading strategy, transaction, security, or investment. You acknowledge and agree that any use of the Services, any decisions made in reliance on the Services, including any trading or investment decisions or strategies, are made at your own risk. If investment, trading, or other professional advice is required, the services of a competent, licensed professional should be sought. No employee, agent, or representative of Stratezy Labs, Inc. is authorized to provide any such advice pursuant to this Agreement, and any such advice, if given, is in violation of Stratezy Labs, Inc.'s policies, and unauthorized and hence should not be relied upon.</p>
                    <p className={descriptionStyling}>You are Solely Responsible for Input, Correctness, and Accuracy. The quality of the product's analysis and optimization depends on the user's inputs. After deployment, alerts have been made available in the product to ease and expedite your entry of the position, and you, as user of the system, are solely responsible for ensuring the quality of all its inputs. As such, you must carefully review all input parameters in all ways necessary to ensure their accuracy and fidelity. While there are other factors governing analysis and optimization accuracy, the quality of the product outputs depends on the accuracy of your inputs. The trades generated by the Service may increase beyond what is practical to execute, due to broker execution limits and the difficulties in executing a complex trade in an all-or-none fashion. Moreover, once the trade is executed, the management of a complex trade becomes more difficult than is normally the case. Another factor is that you may not be authorized to execute all contract types found in the solutions generated. Stratezy Labs, Inc. makes no representation that a solution generated by the Service can be executed and effectively monitored and managed in practice. It is entirely your responsibility to assess the appropriateness, suitability, and practicality of the solutions generated by the optimizer. It is your responsibility to ensure the trade is executable and manageable, and appropriate for your needs.</p>
                </div>

                {/* Intellectual property and Trademark */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Intellectual property and Trademark</h4>
                    <p className={descriptionStyling}>
                        Welcome to &nbsp;
                        <a
                            style={{ textDecoration: "underline", color: "blue" }}
                            href="https://www.stratezylabs.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.stratezylabs.ai
                        </a>
                        &nbsp; and &nbsp;
                        <a
                            style={{ textDecoration: "underline", color: "blue" }}
                            href="https://www.stratezylabs.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.stratezylabs.com
                        </a>
                    </p>
                    <p className={descriptionStyling}>You hereby agree that the Company shall be the owner of all Content created because of your use of the Platform or Services. To the extent that the law recognizes You as the owner of any right in any such data or information, You hereby agree that all such rights shall be assigned to the Company immediately upon creation except for your private data under the data privacy law applicable. To the extent such an assignment is not permitted under applicable law, You agree to provide a perpetual, assignable, exclusive, and royalty-free license to enjoy all rights in the such Content owned by You. You agree to take all necessary actions as required by the Company to give effect to this clause.</p>
                    <p className={descriptionStyling}>The trademarks, logos and service marks displayed on the Platform (“Marks”) are the property of the Company or a third party. You are not permitted to use the Marks without the prior consent of the Company or the third party that may own the Marks. </p>
                </div>

                {/* Backtesting and data */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Backtesting and data</h4>
                    <p className={descriptionStyling}>Backtesting results are hypothetical and are simulated on historical data. The performance results have certain inherent limitations. Unlike the results shown in an actual performance record, these results do not represent actual trading. These trades have not actually been executed, these results may have under-or over-compensated for the impact especially when we have lack of liquidity in the market or news driven events or any other conditions. Simulated or hypothetical trading strategies in general are also subject to the fact that they are designed with the benefit of hindsight.  No representation is being made that any account will or is likely to achieve profits or losses similar to those backtested.</p>
                    <p className={descriptionStyling}>In addition, hypothetical trading does not involve financial risk, and no hypothetical trading record can completely account for the impact of financial risk in actual trading. For example, the ability to withstand losses or to adhere to a particular trading Strategies despite trading losses are material points which can also adversely affect actual trading results. There are numerous other factors related to the markets in general or to the implementation of any specific Strategies trading which cannot be fully accounted for in the preparation of hypothetical performance results and all of which can adversely affect actual trading results.</p>
                    <p className={descriptionStyling}>Chart data is subjected to minor variations from market time to post market times due to standard data adjustments.</p>
                </div>


                {/* Electronic Communications */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Electronic Communications</h4>
                    <p className={descriptionStyling}>You acknowledge and understand that (a) we can only give you the benefits of accessing the Site and using the Services by conducting business through the Internet, and therefore we need you to consent to our giving you Communications (defined below) electronically, and (b) this Section informs you of your rights when receiving Communications from us electronically. For contractual purposes, you: (i) consent to receive communications from us in an electronic form and (ii) agree that all terms and conditions, agreements, notices, documents, disclosures, and other communications (“Communications”) that we provide to you electronically satisfy any legal requirement that such Communications would satisfy if they were in writing. Your consent to receive Communications and do business electronically, and our agreement to do so, applies to all of your interactions and transactions with us. The foregoing does not affect your non-waivable rights. You further agree to receive all service communications from Stratezy Labs.</p>
                </div>

                {/* Indemnification */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Indemnification</h4>
                    <p className={descriptionStyling}>You agree to indemnify, defend, and hold Stratezy Labs, Inc. the owner(s) of Stratezy Labs Platform, and its subsidiaries, affiliates, officers, directors, agents, co-branders, sponsors, distributors, or other partners, employees, and representatives harmless from and against any and all claims, demands, actions, causes of action, damages, losses, costs or expenses (including reasonable attorneys' fees and disbursements) which arise or relate, directly or indirectly, out of, from or to (i) your breach of this Agreement or violation of any applicable law or regulation, (ii) any allegation that any materials that you submit to Stratezy Labs, Inc. infringe, misappropriate, or otherwise violate the copyright, trade secret, trademark or other intellectual property rights, or any other rights of a third party, or (iii) access or use of the Site and/or the Services by you or anyone using your Stratezy Labs, Inc. account. This Section shall survive in the event this Agreement is terminated for any reason.</p>
                </div>

                {/* Limitation of Liability */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Limitation of Liability</h4>
                    <p className={descriptionStyling}>YOU ACKNOWLEDGE AND AGREE THAT WE ARE ONLY WILLING TO PROVIDE ACCESS TO THE SITE AND TO PROVIDE THE SERVICES IF YOU AGREE TO CERTAIN LIMITATIONS OF OUR LIABILITY TO YOU AND TO THIRD PARTIES. NEITHER STRATEZY LABS, INC. NOR ITS DIRECTORS, OFFICERS, EMPLOYEES, CONTRACTORS, AGENTS OR SPONSORS ARE RESPONSIBLE OR LIABLE TO YOU OR ANYONE ELSE FOR ANY LOSS OR INJURY OR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, PUNITIVE OR OTHER DAMAGES UNDER ANY CONTRACT, NEGLIGENCE, STRICT LIABILITY OR OTHER THEORY ARISING OUT OF OR RELATING IN ANY WAY TO (I) THE USE OF, DELAYS IN OPERATION, TRANSMISSION OR RESPONSE OF, OR INABILITY TO USE THE SITE OR THE SERVICES; (II) ANY CONTENT CONTAINED ON THE SITES AND/OR THE SERVICES; (III) STATEMENTS OR CONDUCT POSTED OR MADE PUBLICLY AVAILABLE ON THE SITES AND/OR THE SERVICES; (IV) ANY PRODUCT OR SERVICE PURCHASED OR OBTAINED THROUGH THE SITES; (V) ANY ACTION TAKEN IN RESPONSE TO OR AS A RESULT OF ANY INFORMATION AVAILABLE ON THE SITES OR THE SERVICES; (VI) ANY DAMAGE CAUSED BY MISTAKES, INACCURACIES, OMISSIONS, ERRORS, INTERRUPTIONS OR LOSS OF ACCESS TO, DELETION OF, FAILURE TO STORE, FAILURE TO BACK UP, OR ALTERATION OF ANY CONTENT ON THE SITES OR THE SERVICES, OR (VII) ANY OTHER FAILURE OF PERFORMANCE OF THE SITE OR SERVICES OR OTHER MATTER RELATING TO THE SITE AND/OR THE SERVICES, IN EACH CASE WHETHER OR NOT CAUSED BY EVENTS BEYOND THE CONTROL OF OUR DIRECTORS, OFFICERS, EMPLOYEES, CONTRACTORS, AGENTS OR SPONSORS, INCLUDING, BUT NOT LIMITED TO, ACTS OF NATURE, COMMUNICATIONS LINE FAILURE, THEFT, DESTRUCTION, OR UNAUTHORIZED ACCESS TO THE SITE OR SERVICES OR CONTENT STORED THEREIN. IN NO EVENT SHALL STRATEZY LABS, INC.'S TOTAL LIABILITY TO YOU FOR ANY AND ALL DAMAGES, LOSSES, AND CAUSES OF ACTION (WHETHER IN CONTRACT, TORT, STATUTORY, OR OTHERWISE) EXCEED ONE RUPEE (RS 1.00) FOR CUSTOMERS IN INDIA AND ONE US DOLLAR (USD 1) FOR CUSTOMERS IN THE USA. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF CERTAIN TYPES OF LIABILITY. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS AND DISCLAIMERS MAY NOT APPLY TO YOU. TO THE EXTENT THAT WE MAY NOT, AS A MATTER OF APPLICABLE LAW, DISCLAIM ANY IMPLIED WARRANTY OR LIMIT LIABILITIES, THE SCOPE AND DURATION OF SUCH WARRANTY AND THE EXTENT OF OUR LIABILITY WILL BE THE MINIMUM PERMITTED UNDER SUCH APPLICABLE LAW.</p>
                </div>

                {/* Force majeure */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Force majeure</h4>
                    <p className={descriptionStyling}>Stratezy Labs Inc. shall not be responsible for delay or default in the performance of their obligations due to contingencies beyond their control, such as (including but not limited to) losses caused directly or indirectly by exchange or market rulings, suspension of trading, fire, flood, civil commotion, earthquake, war, strikes, failure of the systems, failure of the internet links or government/regulatory action.</p>
                </div>

                {/* Use of Internet */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Use of Internet</h4>
                    <p className={descriptionStyling}>The Client is aware and acknowledges that trading over the internet involves many uncertain factors and complex hardware, software, systems, communication lines, peripherals, etc., which are susceptible to interruptions and dislocations; and the Rebalance Portfolio services of Stratezy Labs Platform may at any time be unavailable without further notice. Upon using rebalance portfolio feature, based on client's network speed, a network latency can be experienced, and any rapid clicks on associated button through same or different windows can lead to multiple order placements. Clients take full responsibility on making sure the actions on the notifications are their own actions and are fully aware of their positions and strategy status when on the rebalance button. Stratezy Labs Platform do not make any representation or warranty that the Online Trading Service of broker(s) or Stratezy Labs Platform will always be available to the Client without any interruption. The Client agrees that he shall not have any claim against the Exchange or broker(s) or Stratezy Labs Platform or Stratezy Labs Inc. on account of any suspension, interruption, non-availability or malfunctioning of the Rebalance Portfolio feature, or the Online Trading System or Service of broker(s) or the Exchange's service or systems for any reason whatsoever.</p>
                </div>

                {/* Eligibility to Use */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Eligibility to Use</h4>
                    <p className={descriptionStyling}>Services of this Platform are not available to any Users suspended or removed by the Company for any reason whatsoever. You represent that You are not a person barred from receiving services from the Platform under the applicable laws.</p>
                    <p className={descriptionStyling}>The Company reserves the right to refuse access to the Platform to new Users or to terminate access granted to existing Users at any time without according any reasons for doing so. </p>
                    <p className={descriptionStyling}>You shall not have more than one active Account on the Platform. Additionally, You are prohibited from selling, trading, or otherwise transferring Your Account to another party or impersonating any other person for the purpose of creating an account with the Platform. </p>
                    <p className={descriptionStyling}>You undertake that you are allowed to use the broker services and are allowed to participate in the markets under the applicable law, and while you are availing our services will continue to comply with the policies of the Exchanges/Brokers involved.</p>
                </div>

                {/* Social Media/Networks */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Social Media/Networks</h4>
                    <p className={descriptionStyling}>In using certain Services, You authorize us to act on Your behalf to access and interact with social media/networking sites such as Facebook and Twitter (any such site, a "SN Site") to retrieve information from such SN Sites for the purpose of accessing the Platform. We will not collect Your username and password for any such SN Site, and We will instead store the unique authorization code (or a “token”) provided to Us by the SN Site to access it on your behalf. You can revoke Our access to an SN Site at any time by amending the appropriate settings from within Your account settings on that site and/or on Our Platform. You should note that an SN Site may change or amend its guidelines and Our access to it at any time, and we cannot guarantee that our Services will always include a connection to such SN Site. You represent and warrant that You will always comply with the relevant terms and conditions of any SN Site in using Our Platform and Services</p>
                </div>

                {/* Customer Support */}
                <div className={sectionStyling}>
                    <h4 className={headingStyling}>Customer Support</h4>
                    <p className={descriptionStyling}>We provide only email support which can be availed by all our users by writing to support@stratezylabs.com Platform. The turnaround time for any email query is 48 working hours. Do note that Weekends and National holidays are to be excluded. We reserve the right to not respond to emails that have abusive content. </p>
                </div>

            </div>
        </div>
    )
}

export default TermsAndCondtions
