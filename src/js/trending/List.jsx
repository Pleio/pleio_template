import React from "react"
import ContentHeader from "../core/components/ContentHeader"
import TrendingList from "./containers/TrendingList"
import ContentFilters from "./containers/ContentFilters"

import Card from "./components/Card"
import Trending from "../activity/components/Trending"

export default class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeSubtype = (subtype) => this.setState({ subtype })

        this.state = {
            subtype: "",
        }
    }

    render() {
        return (
            <div className="page-layout">
                <section className="section">
                    <div className="container">
                        <h3 className="main__title ___trending">
                            {this.props.params.tag}
                        </h3>
                        <ContentFilters page="trending" onChangeSubtype={this.onChangeSubtype} />
                    </div>
                </section>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 last-lg top-lg">
                                <div className="row fill">
                                    <Trending />
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                <TrendingList childClass={Card} className="col-sm-12 col-lg-8" subtype={this.state.subtype} tags={[this.props.params.tag]} offset={0} limit={50} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
