import React from "react"
import TopMenu from "../containers/TopMenu"
import TopNavigation from "./TopNavigation"
import Logo from "./Logo"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import autobind from "autobind-decorator"
import EditPencil from "../../admin/components/EditPencil"
import { Link } from "react-router-dom"

class Container extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            editModeEnabled: false
        }
    }

    @autobind
    toggleEditMode() {
        this.setState({ editModeEnabled: !this.state.editModeEnabled })
    }

    render() {
        const { site, viewer } = this.props.data

        const editModeEnabled = this.state.editModeEnabled

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
                    <TopMenu data={this.props.data} editModeEnabled={this.state.editModeEnabled} />
                </header>
                <main id="skip-navigation" className="page-layout__main ___no-padding">
                    {this.props.children}
                </main>
                <div className="navigation-overlay" />
                {viewer && viewer.isAdmin && !editModeEnabled &&
                    <EditPencil toggleEditMode={this.toggleEditMode} />
                }
                {editModeEnabled &&
                    <div className="cms__panel">
                        <button className="___close" onClick={this.toggleEditMode} />
                        <a href="/admin/"><button className="___settings" /></a>
                    </div>
                }
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