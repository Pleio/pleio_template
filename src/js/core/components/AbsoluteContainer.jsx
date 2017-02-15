import React from "react"
import TopMenu from "../containers/TopMenu"
import Login from "../Login"
import Register from "../Register"
import ForgotPassword from "../ForgotPassword"
import SearchOverlay from "../../search/components/SearchOverlay"

export default class AbsoluteContainer extends React.Component {
    render() {
        return (
            <div className="page-layout">
                <header className="page-layout__header">
                    <TopMenu className="___absolute" />
                </header>
                <main id="skip-navigation" className="page-layout__main ___no-padding">
                    {this.props.children}
                </main>
                <SearchOverlay />
            </div>
        )
    }
}