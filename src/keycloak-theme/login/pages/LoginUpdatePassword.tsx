import type { JSX } from "keycloakify/tools/JSX";
import { useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("password", "password-confirm")}
            headerNode={"Reset your password"}
        >
            <form id="kc-passwd-update-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-[10px]">
                        <div>
                            <label htmlFor="password-new" className="font-medium leading-[16.94px] text-sm">
                                {/* {msg("passwordNew")} */}
                                {"Enter Password"}
                            </label>
                        </div>
                        <div>
                            <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-new">
                                <input
                                    type="password"
                                    id="password-new"
                                    name="password-new"
                                    className={`px-5 py-4 text-sm`}
                                    autoFocus
                                    autoComplete="new-password"
                                    aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                                />
                            </PasswordWrapper>

                            {messagesPerField.existsError("password") && (
                                <span
                                    id="input-error-password"
                                    className={`${kcClsx("kcInputErrorMessageClass")} inline-block mt-[10px]`}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("password"))
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-[10px]">
                        <div>
                            <label htmlFor="password-confirm" className="font-medium leading-[16.94px] text-sm">
                                {msg("passwordConfirm")}
                            </label>
                        </div>
                        <div>
                            <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-confirm">
                                <input
                                    type="password"
                                    id="password-confirm"
                                    name="password-confirm"
                                    className={`px-5 py-4 text-sm`}
                                    autoFocus
                                    autoComplete="new-password"
                                    aria-invalid={messagesPerField.existsError("password", "password-confirm")}
                                />
                            </PasswordWrapper>

                            {messagesPerField.existsError("password-confirm") && (
                                <span
                                    id="input-error-password-confirm"
                                    className={`${kcClsx("kcInputErrorMessageClass")} inline-block mt-[10px]`}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("password-confirm"))
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className={kcClsx("kcFormGroupClass")}>
                    <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <input
                            className={`${kcClsx(
                                "kcButtonClass",
                                "kcButtonPrimaryClass",
                                !isAppInitiatedAction && "kcButtonBlockClass",
                                "kcButtonLargeClass"
                            )} !text-white text-sm leading-[16.94px] font-medium h-[49px] !bg-primary-blue hover:!bg-primary-blue-hover`}
                            type="submit"
                            value={"Update Password"}
                            // value={msgStr("doSubmit")}
                        />
                        {isAppInitiatedAction && (
                            <button
                                className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass")}
                                type="submit"
                                name="cancel-aia"
                                value="true"
                            >
                                {msg("doCancel")}
                            </button>
                        )}
                    </div>
                </div>
            </form>
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

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);

        assert(passwordInputElement instanceof HTMLInputElement);

        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className={`${kcClsx("kcInputGroup")} h-[49px] rounded-md text-primary border-primary-grey border relative overflow-hidden focus-within:overflow-visible`}>
            {children}
            <button
                type="button"
                // className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                className={`absolute flex justify-center items-center hover:bg-slate-100 z-[999] right-0 h-full w-[40px] text-base text-secondary`}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {
                    isPasswordRevealed ?
                        <IoEyeOffOutline aria-hidden /> :
                        <IoEyeOutline aria-hidden />
                }
            </button>
        </div>
    );
}
