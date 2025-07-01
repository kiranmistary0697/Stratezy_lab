import routes from "./Routes";

export const FooterLinks = [
    {
        title: "Company",
        links: [
            { title: "Business Address", link: routes.homepage },
            { title: "Mailing Address", link: routes.homepage },
            { title: "Products", link: routes.products },
            { title: "Docs", link: "#" },
            { title: "Contact us", link: "mailto:support@stratezylabs.com"},
        ],
    },
    {
        title: "Stratezy Labs, Inc.",
        links: [
            { title: "131 Continental Dr, Suite 305, Newark, DE 19713.", link: "mailto:support@stratezylabs.com"},
            { title: "2093 Philadelphia Pike #2825, Claymont, DE 19703", link: "mailto:support@stratezylabs.com"},
            { title: "Terms & Conditions", link: routes.termsAndConditions },
            { title: "Privacy Policy", link: routes.privacyPolicy },
            { title: "Risk Disclosure", link: routes.riskDisclosure },
        ],
    },
];