/* /src/components/auth/logout.jsx */

import * as React from "react";
import { AuthConsumer } from "../../providers/authProvider";
import { LoadingModal } from "../Common/LoadingModal/LoadingModal";

export const Logout = () => (
    <AuthConsumer>
        {({ logout }) => {
            logout();
            return <LoadingModal
                id="logoutLoadingModal"
                isModalOpen={true}
            />;
        }}
    </AuthConsumer>
);