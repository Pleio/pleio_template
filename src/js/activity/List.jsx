import React from "react"
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

    render() {
        const { site } = this.props.data
        let leader, initiativeWidget

        if (site && site.showLeader) {
            leader = (
                <Lead title="Leraar.nl" image="/mod/pleio_template/src/images/lead-home.jpg" />
            )
        }

        if (site && site.showInitiativeWidget) {
            initiativeWidget = (
                <Initiative />
            )
        }

        return (
            <section className="section ___less-padding-top">
                <Document title="Activiteiten" />
                <div className="container">
                    {leader}
                    <ContentFilters onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} selectClassName="___margin-top ___margin-bottom ___margin-bottom-mobile ___filter">
                        <div className="col-sm-4 col-lg-3 col-lg-offset-3 end-lg middle-lg">
                            <UsersOnline isGrey={true} />
                        </div>
                    </ContentFilters>
                    <div className="row">
                        <div className="col-sm-12 col-lg-4 last-lg top-lg">
                            <div className="row fill">
                                <Recommended />
                                <Trending />
                                {initiativeWidget}
                                <Footer />
                            </div>
                        </div>
                        <ActivityList childClass={Card} className="col-sm-12 col-lg-8" tags={this.state.tags} offset={0} limit={50} />
                    </div>
                </div>
            </section>
        )
    }
}

const Query = gql`
    query ActivityList {
        site {
            guid
            showLeader
        }
    }
`
export default graphql(Query)(Activity)