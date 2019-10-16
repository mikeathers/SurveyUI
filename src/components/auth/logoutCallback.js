/* /src/components/auth/logoutCallback.jsx */

import React from "react";
import { AuthConsumer } from "../../providers/authProvider";
import { LoadingModal } from "../Common/LoadingModal/LoadingModal";

export const LogoutCallback = () => (
    <AuthConsumer>
        {({ signoutRedirectCallback }) => {
            signoutRedirectCallback();
            return <LoadingModal
                id="signoutRedirectCallbackLoadingModal"
                isModalOpen={true}
            />;
        }}
    </AuthConsumer>
);