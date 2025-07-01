import { Fragment } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { otpLogin, url, messagesPerField } = kcContext;

    // const { msg, msgStr } = i18n;

    const user = kcContext?.login?.username;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            // headerNode={msg("doLogIn")}
        >
            <form id="kc-otp-login-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className={kcClsx("kcFormGroupClass")}>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                                <Fragment key={index}>
                                    <input
                                        id={`kc-otp-credential-${index}`}
                                        className={kcClsx("kcLoginOTPListInputClass")}
                                        type="radio"
                                        name="selectedCredentialId"
                                        value={otpCredential.id}
                                        defaultChecked={otpCredential.id === otpLogin.selectedCredentialId}
                                    />
                                    <label htmlFor={`kc-otp-credential-${index}`} className={kcClsx("kcLoginOTPListClass")} tabIndex={index}>
                                        <span className={kcClsx("kcLoginOTPListItemHeaderClass")}>
                                            <span className={kcClsx("kcLoginOTPListItemIconBodyClass")}>
                                                <i className={kcClsx("kcLoginOTPListItemIconClass")} aria-hidden="true"></i>
                                            </span>
                                            <span className={kcClsx("kcLoginOTPListItemTitleClass")}>{otpCredential.userLabel}</span>
                                        </span>
                                    </label>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-[10px] mb-[30px]">
                    <h1 className="text-xl leading-6 font-semibold text-primary">Multi Factor Authenticator</h1>
                    <span className="text-sm">
                        {user ? `Enter the code from the Authenticator app configured for ${user}` : "Enter the code from the Authenticator app"}
                    </span>
                </div>

                <div className={`${kcClsx("kcFormGroupClass")} flex flex-col gap-[10px]`}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="otp" className={`${kcClsx("kcLabelClass")} text-primary font-medium text-sm leading-[16.94px]`}>
                            Enter One Time OTP
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <input
                            id="otp"
                            name="otp"
                            autoComplete="off"
                            type="text"
                            className="w-full h-[49px] rounded-md text-primary border-primary-grey border px-5 py-4 text-sm"
                            autoFocus
                            aria-invalid={messagesPerField.existsError("totp")}
                        />
                        {messagesPerField.existsError("totp") && (
                            <span
                                id="input-error-otp-code"
                                className={`${kcClsx("kcInputErrorMessageClass")} inline-block mt-[10px]`}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("totp"))
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                    </div>
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <input
                            className={`${kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")} !text-white text-sm leading-[16.94px] font-medium h-[49px] !bg-primary-blue hover:!bg-primary-blue-hover`}
                            name="login"
                            id="kc-login"
                            type="submit"
                            value={"Verify Code"}
                        />
                    </div>
                </div>
            </form>
        </Template>
    );
}
