import React from "react"
import classnames from "classnames"
import ActivityList from "./containers/ActivityList"
import ContentHeader from "../core/components/ContentHeader"
import Lead from "./components/Lead"
import ContentFilters from "../core/containers/ContentFilters"
import UsersOnline from "../core/containers/UsersOnline"
import Card from "./components/Card"
import Recommended from "./components/Recommended"
import Trending from "./components/Trending"
import Initiative from "./components/Initiative"
import Footer from "./components/Footer"
import Document from "../core/components/Document"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Activity extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeFilter = (tags) => this.setState({ tags })

        this.state = {
            tags: []
        }
    }

    componentWillReceiveProps(nextProps) {
        const { data } = nextProps

        if (data.viewer && data.viewer.loggedIn && this.state.tags.length === 0) {
            this.setState({ tags: ["mine"] })
        }
    }

    render() {
        const { site, viewer } = this.props.data

        if (!viewer) {
            return (
                <div />
            )
        }

        let leader, initiative
        if (site && site.showLeader && !viewer.loggedIn) {
            leader = (
                <Lead />
            )
        }

        if (site) {
            initiative = (
                <Initiative site={site} />
            )
        }

        return (
            <section className={classnames({"section":true, "padding-top": !leader, "___less-padding-top": leader})}>
                <Document title="Activiteiten" />
                <div className="container">
                    {leader}
                    <ContentFilters onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} onActivity>
                        <div className="col-right middle-lg">
                            <UsersOnline isGrey={true} />
                        </div>
                    </ContentFilters>
                    <div className="row">
                        <div className="col-sm-12 col-lg-4 last-lg top-lg">
                            <div className="row">
                                <Recommended />
                                <Trending />
                                {initiative}
                                <Footer />
                            </div>
                        </div>
                        <ActivityList containerClassName="col-sm-12 col-lg-8" childClass={Card} tags={this.state.tags} offset={0} limit={20} />
                    </div>
                </div>
            </section>
        )
    }
}

const Query = gql`
    query ActivityList {
        viewer {
            guid
            loggedIn
        }
        site {
            guid
            showLeader
            showInitiative
            logo
            initiatorLink
        }
    }
`
export default graphql(Query)(Activity)