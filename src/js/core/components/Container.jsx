import React from "react"
import TopMenu from "../containers/TopMenu"
import SearchOverlay from "../../search/components/SearchOverlay"

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
                <SearchOverlay />
            </div>
        )
    }
}