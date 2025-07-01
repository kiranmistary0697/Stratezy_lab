import { Fragment, useEffect } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
// import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import Logo from "../../V2/assets/Logo.svg";
import routes from "../../V2/constants/Routes";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", kcContext.realm.displayName);
    }, []);

    // useSetClassName({
    //     qualifiedName: "html",
    //     className: kcClsx("kcHtmlClass")
    // });

    // useSetClassName({
    //     qualifiedName: "body",
    //     className: bodyClassName ?? kcClsx("kcBodyClass")
    // });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <div className={`pt-0 px-2 lg:px-0 bg-[#F3F6FC] min-h-[100vh] flex flex-col justify-between items-center font-inter text-left`}>

            {/* Realm name */}
            {/* <div id="kc-header" className={kcClsx("kcHeaderClass")}>
                <div id="kc-header-wrapper" className={kcClsx("kcHeaderWrapperClass")}>
                    {msg("loginTitleHtml", realm.displayNameHtml)}
                </div>
            </div> */}

            <div className={`bg-white px-5 lg:px-10 py-[30px] lg:py-[60px] w-full max-w-[470px] mt-[80px] lg:mt-[180px] rounded-md`}>
                <header className={`${kcClsx("kcFormHeaderClass")} mb-[30px] relative`}>
                    {enabledLanguages.length > 1 && (
                        <div className={`${kcClsx("kcLocaleMainClass")} !absolute right-0 float-end`} id="kc-locale">
                            <div id="kc-locale-wrapper" className={kcClsx("kcLocaleWrapperClass")}>
                                <div id="kc-locale-dropdown" className={clsx("menu-button-links", kcClsx("kcLocaleDropDownClass"))}>
                                    <button
                                        tabIndex={1}
                                        id="kc-current-locale-link"
                                        aria-label={msgStr("languages")}
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        aria-controls="language-switch1"
                                    >
                                        {currentLanguage.label}
                                    </button>
                                    <ul
                                        role="menu"
                                        tabIndex={-1}
                                        aria-labelledby="kc-current-locale-link"
                                        aria-activedescendant=""
                                        id="language-switch1"
                                        className={`${kcClsx("kcLocaleListClass")} max-h-96 overflow-scroll`}
                                    >
                                        {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                            <li key={languageTag} className={kcClsx("kcLocaleListItemClass")} role="none">
                                                <a role="menuitem" id={`language-${i + 1}`} className={kcClsx("kcLocaleItemClass")} href={href}>
                                                    {label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-y-[30px]">
                        <img src={Logo} alt="Orion_Logo" className="w-[92px] h-[26px]" />

                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <div className="text-secondary text-sm">
                                <span
                                    // className={kcClsx("kcAlertTitleClass")}
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </div>
                        )}
                        
                        {(() => {
                            const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                <div id="kc-page-title" className="text-primary font-semibold text-xl leading-[24px]">
                                    {headerNode}
                                </div>
                            ) : (
                                // <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                //     <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                //     <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                //         <div className="kc-login-tooltip">
                                //             <i className={kcClsx("kcResetFlowIcon")}></i>
                                //             <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                //         </div>
                                //     </a>
                                // </div>
                                <Fragment />
                            );

                            if (displayRequiredFields) {
                                return (
                                    <div className={kcClsx("kcContentWrapperClass")}>
                                        <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                            <span className="subtitle">
                                                <span className="required">*</span>
                                                {msg("requiredFields")}
                                            </span>
                                        </div>
                                        <div className="col-md-10">{node}</div>
                                    </div>
                                );
                            }

                            return node;
                        })()}
                    </div>
                </header>

                <div id="kc-content">
                    <div
                    // id="kc-content-wrapper"
                    >
                        {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                        {/* {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                            <div
                                className={clsx(
                                    `alert-${message.type}`,
                                    kcClsx("kcAlertClass"),
                                    `pf-m-${message?.type === "error" ? "danger" : message.type}`, `mb-[30px]`
                                )}
                            >
                                <div className="pf-c-alert__icon">
                                    {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                    {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                    {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                    {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                </div>
                                <span
                                    className={kcClsx("kcAlertTitleClass")}
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(message.summary)
                                    }}
                                />
                            </div>
                        )} */}
                        {children}
                        {auth !== undefined && auth.showTryAnotherWayLink && (
                            <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <input type="hidden" name="tryAnotherWay" value="on" />
                                    <a
                                        href="#"
                                        id="try-another-way"
                                        onClick={() => {
                                            document.forms["kc-select-try-another-way-form" as never].submit();
                                            return false;
                                        }}
                                    >
                                        {msg("doTryAnotherWay")}
                                    </a>
                                </div>
                            </form>
                        )}
                        {socialProvidersNode}
                        {displayInfo && (
                            <>
                                {infoNode}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <footer className="flex text-sm text-secondary justify-center gap-5 w-full my-[58px] bg-[#F3F6FC]">
                <span>© Orion</span>
                <a target="_blank" href={`https://stratezylabs.ai${routes.privacyPolicy}`}>Privacy Policy</a>
                <a target="_blank" href={`https://stratezylabs.ai${routes.termsAndConditions}`}>Terms & Conditions</a>
            </footer>
        </div>
    );
}
