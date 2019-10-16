import * as React from "react";
import { AuthConsumer } from "../../providers/authProvider";
import { LoadingModal } from "../Common/LoadingModal/LoadingModal";

export const Callback = () => (
    <AuthConsumer>
        {({ signinRedirectCallback }) => {
            signinRedirectCallback();
            return <LoadingModal
                id="signinRedirectCallbackLoadingModal"
                isModalOpen={true}
            />;
        }}
    </AuthConsumer>
);