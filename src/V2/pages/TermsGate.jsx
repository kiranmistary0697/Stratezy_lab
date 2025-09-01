import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext.jsx";
import { BACKEND_BASE_URL, authEndpoints } from "../services/apiEndpoints";

const { ACCEPTANCE_TNC_RISK_PRIVACY_API } = authEndpoints;

/**
 * Props:
 * - apiUrl?: string (default falls back to ACCEPTANCE_TNC_RISK_PRIVACY_API)
 * - onSubmitted?: (serverJson) => void
 * - onCancel?: () => void  (default: window.location.assign("/logout"))
 * - user?: { id?: string; email?: string; name?: string; [k:string]: any }
 * - consentVersion?: string  e.g., "pp:1.0|tnc:1.0|risk:1.0"
 * - extraMeta?: object       additional fields included in the request body
 */
export default function TermsGate({
  apiUrl,
  onSubmitted,
  onCancel,
  user,
  consentVersion,
  extraMeta = {},
}) {
  const navigate = useNavigate();
  const { authToken } = useAuth();

  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'success'|'error', text:string}
  const [ip, setIp] = useState(null);

  // --- Best-effort public IP with abort, fail silently ---
  useEffect(() => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    (async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json", { signal: ctrl.signal });
        if (res.ok) {
          const j = await res.json();
          setIp(j?.ip ?? null);
        }
      } catch {
        /* ignore */
      } finally {
        clearTimeout(t);
      }
    })();
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, []);

  const canSubmit = useMemo(() => checked && !submitting, [checked, submitting]);

  // --- API submit helper; prefers prop apiUrl, falls back to constant ---
  const submitAcceptanceDetails = useCallback(async (formData) => {
    const endpoint = apiUrl || ACCEPTANCE_TNC_RISK_PRIVACY_API;
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
    const response = await axios.post(endpoint, formData, { headers });
    return response.data;
  }, [apiUrl, authToken]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setMsg(null);
    try {
      const payload = {
        acceptedAt: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
        userAgent: navigator.userAgent,
        referrer: document?.referrer || null,
        viewport: {
          width: typeof window !== "undefined" ? window.innerWidth : null,
          height: typeof window !== "undefined" ? window.innerHeight : null,
          devicePixelRatio:
            typeof window !== "undefined" ? window.devicePixelRatio : null,
        },
        ip: extraMeta?.ip ?? ip ?? null,
        user: user ?? null,
        consentVersion: consentVersion ?? null,
        ...extraMeta,
      };

      const response = await submitAcceptanceDetails(payload);

      // Bubble up if needed
      if (typeof onSubmitted === "function") onSubmitted(response);

      // Success UX
      setMsg({ type: "success", text: "Thanks! Your acceptance has been recorded." });
      toast.success("Thanks! Your acceptance has been recorded.");

      // Your existing behavior:
      if (!response.firstTimeLogin) {
        navigate("/Strategies");
      }
    } catch (e) {
      const text =
        e?.response?.data?.message ||
        e?.message ||
        "Something went wrong while submitting.";
      setMsg({ type: "error", text });
      toast.error(text);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) return onCancel();
    window.location.assign("/logout");
  };

  // Expand/Collapse all
  const [allOpen, setAllOpen] = useState(false);
  const toggleAll = () => setAllOpen((v) => !v);

  return (
    <div className="font-inter min-h-screen w-full bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="max-w-[1100px] mx-auto px-5 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Review &amp; Accept</h1>
            <p className="text-sm md:text-base text-gray-600">
              Please review all three documents. You must accept to continue.
              {consentVersion ? (
                <span className="ml-2 inline-block rounded-md bg-gray-100 px-2 py-0.5 text-[12px] text-gray-700 align-middle">
                  Version: {consentVersion}
                </span>
              ) : null}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleAll}
            className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            aria-pressed={allOpen}
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1100px] mx-auto px-5 py-5 md:py-8">
        <div className="space-y-5 md:space-y-6">
          <Section title="Terms & Conditions" forceOpen={allOpen}>
            <ScrollShadow maxHeight={420}>
              <TermsAndCondtions />
            </ScrollShadow>
          </Section>

          <Section title="Privacy Policy" forceOpen={allOpen}>
            <ScrollShadow maxHeight={420}>
              <PrivacyPolicy />
            </ScrollShadow>
          </Section>

          <Section title="Risk Disclosure Statements" forceOpen={allOpen}>
            <ScrollShadow maxHeight={420}>
              <RiskDisclosure />
            </ScrollShadow>
          </Section>
        </div>

        <div className="h-20" />
      </main>

      {/* Sticky action bar */}
      <div className="sticky bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur">
        <div className="max-w-[1100px] mx-auto px-5 py-3 md:py-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <label className="inline-flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 accent-black"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              aria-describedby="acceptance-hint"
            />
            <span id="acceptance-hint" className="text-[15px] leading-5 text-gray-800">
              I have read and accept the <b>Terms &amp; Conditions</b>, <b>Privacy Policy</b>,
              and <b>Risk Disclosure</b>.
            </span>
          </label>

          <div className="flex gap-2 md:gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60 min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              aria-busy={submitting}
              className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 disabled:opacity-60 min-h-[44px]"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        {/* Inline message (accessible, non-toast) */}
        <div aria-live="polite" aria-atomic="true">
          {msg && (
            <div className="max-w-[1100px] mx-auto px-5 pb-3">
              <div
                className={`text-sm rounded-md px-3 py-2 ${msg.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** Accessible accordion with chevron and subtle hover */
function Section({ title, children, forceOpen = false }) {
  const detailsRef = useRef(null);

  // Keep local open state aligned with global "Expand/Collapse all"
  useEffect(() => {
    if (!detailsRef.current) return;
    if (forceOpen) {
      detailsRef.current.open = true;
    } else {
      detailsRef.current.open = false;
    }
  }, [forceOpen]);

  return (
    <details
      ref={detailsRef}
      className="group rounded-2xl ring-1 ring-gray-200 bg-white"
    >
      <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-3 px-4 md:px-6 py-3 md:py-4 bg-gray-50 hover:bg-gray-100">
        <span className="text-lg md:text-xl font-semibold text-gray-900">{title}</span>
        <svg
          className="h-5 w-5 text-gray-700 transition-transform group-open:rotate-180"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="px-0 md:px-0 py-0">{children}</div>
    </details>
  );
}

/**
 * Adds top/bottom scroll shadows inside long sections, improving
 * mobile readability without taking over the layout.
 */
function ScrollShadow({ children, maxHeight = 420 }) {
  const ref = React.useRef(null);
  const [atTop, setAtTop] = React.useState(true);
  const [atBottom, setAtBottom] = React.useState(false);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    setAtTop(scrollTop <= 1);
    setAtBottom(scrollTop + clientHeight >= scrollHeight - 1);
  };

  React.useEffect(() => { onScroll(); }, []);

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={onScroll}
        style={{ maxHeight, WebkitOverflowScrolling: "touch" }}
        className="
          overflow-y-auto overflow-x-auto
          px-4 md:px-6 py-4
          w-full max-w-full
        "
      >
        {/* This wrapper forces safe line wrapping even for long URLs/words */}
        <div className="break-words [overflow-wrap:anywhere] [word-break:break-word]">
          {children}
        </div>
      </div>

      {!atTop && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 h-4 bg-gradient-to-b from-gray-200/60 to-transparent" />
      )}
      {!atBottom && (
        <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-6 bg-gradient-to-t from-gray-200/60 to-transparent" />
      )}
    </div>
  );
}


function PrivacyPolicy() {
  const sectionStyling = "flex flex-col md:gap-y-[35px] gap-y-[18px]";
  const headingStyling =
    "text-primary md:text-[32px] md:leading-[31px] text-[24px] leading-[24px] font-semibold";
  const descriptionStyling =
    "text-secondary md:leading-[33px] md:text-[20px] leading-[28px] text-[16px] font-light";
  const subHeadingStyling =
    "md:text-[28px] md:leading-[29px] text-[22px] leading-[22px] font-semibold mb-4";

  return (
    <div
      className="
    w-full max-w-full
    flex flex-col mx-auto
    md:gap-y-[22px] gap-y-[40px]
    lg:px-[135px] lg:py-[150px] px-[20px] md:py-[20px] py-[60px]
    font-inter
    break-words [overflow-wrap:anywhere] [word-break:break-word]
  ">
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
  );
}

function RiskDisclosure() {
  const sectionStyling = "flex flex-col md:gap-y-[35px] gap-y-[18px]";
  const headingStyling =
    "text-primary md:text-[32px] md:leading-[31px] text-[24px] leading-[24px] font-semibold";
  const descriptionStyling =
    "text-secondary md:leading-[33px] md:text-[20px] leading-[28px] text-[16px] font-light";
  const subHeadingStyling =
    "md:text-[22px] md:leading-[22px] text-[16px] leading-[16px] font-medium text-secondary";

  return (
    <div
      className="
    w-full max-w-full
    flex flex-col mx-auto
    md:gap-y-[22px] gap-y-[40px]
    lg:px-[135px] lg:py-[150px] px-[20px] md:py-[20px] py-[60px]
    font-inter
    break-words [overflow-wrap:anywhere] [word-break:break-word]
  ">
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
  );
}

function TermsAndCondtions() {
  const sectionStyling = "flex flex-col md:gap-y-[35px] gap-y-[18px]";
  const headingStyling =
    "text-primary md:text-[32px] md:leading-[31px] text-[24px] leading-[24px] font-semibold";
  const descriptionStyling =
    "text-secondary md:leading-[33px] md:text-[20px] leading-[28px] text-[16px] font-light";
  const subHeadingStyling =
    "md:text-[28px] md:leading-[29px] text-[22px] leading-[22px] font-semibold mb-4";

  return (
    <div
      className="
    w-full max-w-full
    flex flex-col mx-auto
    md:gap-y-[22px] gap-y-[40px]
    lg:px-[135px] lg:py-[150px] px-[20px] md:py-[20px] py-[60px]
    font-inter
    break-words [overflow-wrap:anywhere] [word-break:break-word]
  ">
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
  );
}
