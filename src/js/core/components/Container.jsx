import React from "react"
import TopMenu from "../containers/TopMenu"
import TopNavigation from "./TopNavigation"
import Logo from "./Logo"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Container extends React.Component {
    render() {
        const { site } = this.props.data

        let topNavigation, logo
        if (site && site.theme === "rijkshuisstijl") {
            topNavigation = (
                <TopNavigation data={this.props.data} />
            )
            logo = (
                <Logo data={this.props.data} />
            )
        }

        return (
            <div className="page-layout">
                {topNavigation}
                <header className="page-layout__header">
                    {logo}
                    <TopMenu data={this.props.data} />
                </header>
                <main id="skip-navigation" className="page-layout__main ___no-padding">
                    {this.props.children}
                </main>
                <div className="navigation-overlay" />
            </div>
        )
    }
}

const Query = gql`
    query TopMenu {
        site {
            guid
            logo
            showLogo
            theme
            menu {
                title
                link
            }
            footer {
                title
                link
            }
        }
        viewer {
            guid
            loggedIn
            isAdmin
            user {
                guid
                username
                name
                icon
            }
        }
    }
`

export default graphql(Query)(Container)