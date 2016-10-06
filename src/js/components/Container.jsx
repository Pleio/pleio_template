import React from "react"
import TopMenu from "./TopMenu"
import LoginModal from "../views/LoginModal"
import RegisterModal from "../views/RegisterModal"
import ForgotPasswordModal from "../views/ForgotPasswordModal"

export default class Container extends React.Component {
    render() {
        return (
            <div className="page-layout">
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