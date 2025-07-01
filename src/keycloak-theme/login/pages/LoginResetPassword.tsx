import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, realm, auth, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username")}
            infoNode={realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
            headerNode={"Forgot Password"}
        >
            <form id="kc-reset-password-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                <div className={`flex flex-col gap-[10px]`}>
                    <div>
                        <label htmlFor="username" className="font-medium text-sm">
                            {!realm.loginWithEmailAllowed
                                ? msg("username")
                                : !realm.registrationEmailAsUsername
                                    ? msg("usernameOrEmail")
                                    : `Enter Email Address`
                            }
                        </label>
                    </div>
                    <div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full h-[49px] rounded-md text-primary border-primary-grey border px-5 py-4 text-sm"
                            autoFocus
                            defaultValue={auth.attemptedUsername ?? ""}
                            aria-invalid={messagesPerField.existsError("username")}
                        />
                        {messagesPerField.existsError("username") && (
                            <span
                                id="input-error-username"
                                className={`${kcClsx("kcInputErrorMessageClass")} inline-block mt-[10px]`}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("username"))
                                }}
                            />
                        )}
                    </div>
                </div>
                <div className={`${kcClsx("kcFormGroupClass", "kcFormSettingClass")} mt-3`}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            <span className="text-primary-blue hover:text-primary-blue-hover text-sm leading-[16.94px] font-medium underline underline-offset-4">
                                <a href={url.loginUrl} className="focus:outline-none">{msg("backToLogin")}</a> 
                            </span>
                        </div>
                    </div>

                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <input
                            className={`${kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")} !text-white text-sm leading-[16.94px] font-medium h-[49px] !bg-primary-blue hover:!bg-primary-blue-hover`}
                            type="submit"
                            value={"Send Password Reset Email"}
                        />
                    </div>
                </div>
            </form>
        </Template>
    );
}
