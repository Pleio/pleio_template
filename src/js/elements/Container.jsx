import React from "react"
import TopMenu from "./TopMenu"
import LoginModal from "../pages/LoginModal"
import RegisterModal from "../pages/RegisterModal"
import ForgotPasswordModal from "../pages/ForgotPasswordModal"

export default class Container extends React.Component {
    render() {
        return (
            <div>
                <header className="page-layout__header">
                    <TopMenu />
                </header>
                <main id="skip-navigation" className="page-layout__main ___no-padding">
                    {this.props.children}
                </main>
                <LoginModal />
                <RegisterModal />
                <ForgotPasswordModal />
            </div>
        )
    }
}