import { getKcClsx, KcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useState } from "react";

export default function LoginConfigTotp(props: PageProps<Extract<KcContext, { pageId: "login-config-totp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;

    const {
        msg,
        msgStr,
        // advancedMsg
    } = i18n;

    // State for tracking OTP input
    const [otp, setOtp] = useState("");

    // Check if the OTP field is empty
    const isOtpEmpty = otp.trim() === "";

    const headerNode = () => (
        <div className="flex flex-col gap-[10px]">
            <h1>Set up Authenticator</h1>
            <p className="text-secondary text-sm font-normal">
                Using an Authenticator like <span className="text-primary-blue hover:text-primary-blue-hover cursor-pointer">Google Authenticator</span>, <span className="text-primary-blue hover:text-primary-blue-hover cursor-pointer">Microsoft Authenticator</span> or <span className="text-primary-blue hover:text-primary-blue-hover cursor-pointer">Authy</span>, scan the QR code and enter the one time password below
            </p>
        </div>
    )

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            // headerNode={msg("loginTotpTitle")}
            headerNode={headerNode()}
            displayMessage={!messagesPerField.existsError("totp", "userLabel")}
        >
            <>
                <ol id="kc-totp-setting">
                    {/* <li>
                        <p>{msg("loginTotpStep1")}</p>

                        <ul id="kc-totp-supported-apps">
                            {totp.supportedApplications.map(app => (
                                <li key={app}>{advancedMsg(app)}</li>
                            ))}
                        </ul>
                    </li> */}

                    {mode == "manual" ? (
                        <>
                            <li>
                                <p>{msg("loginTotpManualStep2")}</p>
                                <p>
                                    <span id="kc-totp-secret-key">{totp.totpSecretEncoded}</span>
                                </p>
                                <p>
                                    <a href={totp.qrUrl} id="mode-barcode">
                                        {msg("loginTotpScanBarcode")}
                                    </a>
                                </p>
                            </li>
                            <li>
                                <p>{msg("loginTotpManualStep3")}</p>
                                <ul>
                                    <li id="kc-totp-type">
                                        {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                    </li>
                                    <li id="kc-totp-algorithm">
                                        {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                    </li>
                                    <li id="kc-totp-digits">
                                        {msg("loginTotpDigits")}: {totp.policy.digits}
                                    </li>
                                    {totp.policy.type === "totp" ? (
                                        <li id="kc-totp-period">
                                            {msg("loginTotpInterval")}: {totp.policy.period}
                                        </li>
                                    ) : (
                                        <li id="kc-totp-counter">
                                            {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        </>
                    ) : (
                        <li>
                            {/* <p>{msg("loginTotpStep2")}</p> */}

                            <div className="flex justify-center py-3">
                                <img id="kc-totp-secret-qr-code" src={`data:image/png;base64, ${totp.totpSecretQrCode}`} alt="Figure: Barcode" />
                            </div>
                            {/* <br /> */}
                            {/* <p>
                                <a href={totp.manualUrl} id="mode-manual">
                                    {msg("loginTotpUnableToScan")}
                                </a>
                            </p> */}
                        </li>
                    )}
                    {/* <li>
                        <p>{msg("loginTotpStep3")}</p>
                        <p>{msg("loginTotpStep3DeviceName")}</p>
                    </li> */}
                </ol>

                <form action={url.loginAction} className={kcClsx("kcFormClass")} id="kc-totp-settings-form" method="post">
                    <div className={`${kcClsx("kcFormGroupClass")} flex flex-col gap-[10px]`}>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <label htmlFor="totp" className={`${kcClsx("kcLabelClass")} text-primary font-medium text-sm leading-[16.94px]`}>
                                {/* {msg("authenticatorCode")} */}
                                {"Enter Authenticator Code"}
                            </label>{" "}
                            <span className="required">*</span>
                        </div>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <input
                                type="text"
                                id="totp"
                                name="totp"
                                value={otp} // Controlled component
                                onChange={(e) => setOtp(e.target.value)} // Update state on input change
                                autoComplete="off"
                                className="w-full h-[49px] rounded-md text-primary border-primary-grey border px-5 py-4 text-sm"
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
                        <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                        {mode && <input type="hidden" id="mode" value={mode} />}
                    </div>

                    <div className={`${kcClsx("kcFormGroupClass")} flex flex-col gap-[10px]`}>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <label htmlFor="userLabel" className={`${kcClsx("kcLabelClass")} text-primary font-medium text-sm leading-[16.94px]`}>
                                {msg("loginTotpDeviceName")}
                            </label>{" "}
                            {totp.otpCredentials.length >= 1 && <span className="required">*</span>}
                        </div>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <input
                                type="text"
                                id="userLabel"
                                name="userLabel"
                                autoComplete="off"
                                className="w-full h-[49px] rounded-md text-primary border-primary-grey border px-5 py-4 text-sm"
                                aria-invalid={messagesPerField.existsError("userLabel")}
                            />
                            {messagesPerField.existsError("userLabel") && (
                                <span
                                    id="input-error-otp-label"
                                    className={`${kcClsx("kcInputErrorMessageClass")} inline-block mt-[10px]`}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("userLabel"))
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                    </div>

                    {isAppInitiatedAction ? (
                        <>
                            <input
                                type="submit"
                                className={`${kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")} !text-white text-sm leading-[16.94px] font-medium h-[49px] ${isOtpEmpty ? "bg-primary-grey text-secondary" : "!bg-primary-blue hover:!bg-primary-blue-hover"}`}
                                value={msgStr("doSubmit")}
                                disabled={isOtpEmpty} // Disable button if OTP input is empty
                            />
                            <button
                                type="submit"
                                className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass")}
                                id="cancelTOTPBtn"
                                name="cancel-aia"
                                value="true"
                            >
                                {msg("doCancel")}
                            </button>
                        </>
                    ) : (
                        <input
                            type="submit"
                            className={`${kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")} !text-white text-sm leading-[16.94px] font-medium h-[49px] ${isOtpEmpty ? "bg-primary-grey text-secondary" : "!bg-primary-blue hover:!bg-primary-blue-hover"}`}
                            id="saveTOTPBtn"
                            value={"Set up Authenticator"}
                            disabled={isOtpEmpty} // Disable button if OTP input is empty
                        />
                    )}
                </form>
            </>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { kcClsx, i18n } = props;

    const { msg } = i18n;

    return (
        <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
            <div className={kcClsx("kcFormOptionsWrapperClass")}>
                <div className="checkbox">
                    <label>
                        <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked={true} />
                        {msg("logoutOtherSessions")}
                    </label>
                </div>
            </div>
        </div>
    );
}
