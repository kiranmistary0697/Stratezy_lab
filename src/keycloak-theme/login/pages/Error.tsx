import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import Button from "../../../V2/components/common/Button";

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    return (
        <div id="kc-error-message" className="w-full min-h-[100dvh] flex flex-col items-center justify-center">
            <div className="max-w-[545px] text-center space-y-[22px] mx-3">
                <h1 className="text-primary text-3xl sm:text-[45px] font-semibold sm:leading-[50px]">
                    We can’t find the page you are looking for
                </h1>
                <p className="font-normal text-lg sm:text-2xl sm:leading-[38px] text-secondary">
                    The page you are looking for may be removed, moved or temporarily unavailable. Please check the URL or redirect to home page
                </p>

                <Button
                    variant='filled'
                    onClick={() => window.location.href = "https://stratezylabs.ai"}
                >
                    Go back home
                </Button>

            </div>
        </div>
    );
}
