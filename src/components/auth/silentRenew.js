/* /src/components/auth/silentRenew.jsx */

import React from "react";

import { AuthConsumer } from "../../providers/authProvider";
import { LoadingModal } from "../Common/LoadingModal/LoadingModal";

export const SilentRenew = () => (
    <AuthConsumer>
        {({ signinSilentCallback }) => {
            signinSilentCallback();
            return <LoadingModal
                id="signinSilentCallbackLoadingModal"
                isModalOpen={true}
            />;
        }}
    </AuthConsumer>
);