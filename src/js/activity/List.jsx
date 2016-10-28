import React from 'react'
import ActivityList from "./containers/ActivityList"
import ContentHeader from "../core/components/ContentHeader"
import Lead from "./components/Lead"
import ContentFilters from "../core/containers/ContentFilters"
import UsersOnline from "../core/containers/UsersOnline"
import Card from "./components/Card"
import Recommended from "./components/Recommended"
import Trending from "./components/Trending"
import Initiative from "./components/Initiative"

export default class Activity extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeFilter = (tags) => this.setState({ tags })

        this.state = {
            tags: []
        }
    }

    render() {
        return (
            <section className="section ___less-padding-top">
                <div className="container">
                    <Lead title="Leraar.nl" image="/mod/pleio_template/src/content/lead-1.jpg" />
                    <ContentFilters onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} selectClassName="___margin-top ___margin-bottom">
                        <UsersOnline isGrey={true} />
                    </ContentFilters>
                    <div className="row">
                        <div className="col-sm-12 col-lg-4 last-lg top-lg">
                            <div className="row fill">
                                <Recommended />
                                <Trending />
                                <Initiative />
                            </div>
                        </div>
                        <ActivityList childClass={Card} className="col-sm-12 col-lg-8" tags={this.state.tags} offset={0} limit={50} />
                    </div>
                </div>
            </section>
        )
    }
}
