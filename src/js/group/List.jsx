import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ContentHeader from "../core/components/ContentHeader"
import Document from "../core/components/Document"
import TabMenu from "../core/components/TabMenu"
import GroupsList from "./containers/GroupsList"
import Card from "./components/Card"

class GroupCard extends React.Component {
    render() {
        return (
            <div className="col-lg-6">
                <Card {...this.props} />
            </div>
        )
    }
}

class List extends React.Component {
    render() {
        const { match } = this.props
        const { viewer } = this.props.data

        let filter, title
        switch (match.path) {
            case "/groups/mine":
                filter = "mine"
                title = "Mijn groepen"
                break
            default:
                filter = "all"
                title = "Groepen"
        }

        let add
        if (viewer && viewer.canWriteToContainer) {
            add = (
                <Link to={`groups/add`} className="button ___large ___add ___stick">
                    <span>Maak een groep</span>
                </Link>
            )
        }

        let options = [{ link: "/groups", title: "Alle groepen" }]
        if (viewer && viewer.loggedIn) {
            options.push({ link: "/groups/mine", title: "Mijn groepen" })
        }

        return (
            <div>
                <Document title={title} />
                <ContentHeader className="___no-padding-bottom">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title ___no-margin">Groepen</h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            {add}
                        </div>
                    </div>
                    <TabMenu options={options} marginBottom isMobile isMobileOnly />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <GroupsList type="group" childClass={GroupCard} offset={0} limit={20} filter={filter} hasRows />
                </section>
            </div>
        )
    }
}

const Query = gql`
    query GroupList {
        viewer {
            guid
            loggedIn
            canWriteToContainer(type: group)
        }
    }
`

export default graphql(Query)(List)