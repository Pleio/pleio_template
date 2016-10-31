import React from "react"
import ContentHeader from "../core/components/ContentHeader"
import BookmarkList from "./containers/BookmarkList"
import ContentFilters from "./containers/ContentFilters"

import Card from "./components/Card"
import Recommended from "../activity/components/Recommended"
import Trending from "../activity/components/Trending"

export default class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeFilter = (tags) => this.setState({ tags })
        this.onChangeSubtype = (subtype) => this.setState({ subtype })

        this.state = {
            subtype: "",
            tags: []
        }
    }

    render() {
        return (
            <div className="page-layout">
                <section className="section">
                    <div className="container">
                        <h3 className="main__title">
                            Bewaard
                        </h3>
                        <ContentFilters onChangeTags={this.onChangeFilter} onChangeSubtype={this.onChangeSubtype} selectClassName="___margin-top ___margin-bottom" />
                    </div>
                </section>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 last-lg top-lg">
                                <div className="row fill">
                                    <Recommended />
                                    <Trending />
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                <BookmarkList childClass={Card} className="col-sm-12 col-lg-8" subtype={this.state.subtype} tags={this.state.tags} offset={0} limit={50} />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}