import Img1 from "../assets/Products/Img1.png";
import Img2 from "../assets/Products/Img2.png";
import Img3 from "../assets/Products/Img3.png";
import routes from "./Routes";

export const productsData = [
    {
        id: 0,
        subHeading: 'For beginner traders looking for a head start',
        heading: 'No Code Trading Strategy Building Blocks',
        mobileHeading: 'Out-of-the-Box Trading Strategies',
        description: 'Don’t have time to build your own strategies? Orion provides a library of pre-built trading strategies tailored for various market scenarios.',
        items: [
            "Create your own strategies using intuitive building blocks and conditions designed specifically for beginners. No coding required",
            "Backtest strategies to ensure they align with your goals and market conditions",
            "Deploy your chosen strategies through brokerages like Zerodha, Groww, and Robinhood",
        ],
        button: {
            text: 'Request Access',
            variant: 'filled',
            onClick: (navigate) => navigate(routes.signup),
        },
        image: Img1
    },
    {
        id: 2,
        subHeading: 'For traders who love to take control',
        heading: 'Do-it-yourself (DIY) Trading Strategies',
        description: 'For traders who love to take control, Orion offers advanced tools to build, refine, and perfect trading strategies.',
        items: [
            "Craft strategies using an intuitive code editor or our upcoming AI Powered interface",
            "Validate your ideas across 20+ years of market data without risking your capital",
            "Once tested, seamlessly deploy your strategies to your preferred broker",
        ],
        button: {
            text: 'Request Access',
            variant: 'filled',
            onClick: (navigate) => navigate(routes.signup),
        },
        image: Img2
    },
    {
        id: 3,
        subHeading: 'Expert advise at your fingertips',
        heading: 'Trading Strategies from Advisors Certified by Regulatory Authorities',
        mobileHeading: 'Advisory Trading Strategies',
        description: "Access the wisdom of certified financial advisors through Orion's Advisor Marketplace, designed for those seeking professional guidance.",
        items: [
            "Access trading strategies from advisors who are certified by regulatory bodies such as SEBI",
            "Backtest advisor-created strategies to validate claims before committing.",
            "Use strategies crafted by experts for a fee, and deploy them through your broker of choice.",
            "Advisors retain their intellectual property while you benefit from their expertise.",
        ],
        button: {
            text: 'Request Access',
            variant: 'filled',
            onClick: (navigate) => navigate(routes.signup),
        },
        image: Img3
    },
];