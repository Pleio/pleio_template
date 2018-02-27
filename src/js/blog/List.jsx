import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ContentHeader from "../core/components/ContentHeader"
import BlogList from "./containers/BlogList"
import Card from "./components/Card"
import Trending from "../activity/components/Trending"
import Top from "../core/components/Top"
import ContentFilters from "../core/containers/ContentFilters"
import Document from "../core/components/Document"

class List extends React.Component {
    constructor(props) {
        super(props)

        this.onChangeCanWrite = (canWrite) => this.setState({canWrite})
        this.onChangeFilter = (tags) => this.setState({ tags })

        this.state = {
            tags: []
        }
    }

    render() {
        const { viewer } = this.props.data

        let add
        if (viewer && viewer.canWriteToContainer) {
            add = (
                <Link to={`blog/add`} className="button ___large ___add ___stick">
                    <span>Maak een blog</span>
                </Link>
            )
        }

        return (
            <div>
                <Document title="Blog" />
                <ContentHeader>
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title">Blog</h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            {add}
                        </div>
                    </div>
                    <ContentFilters page="blog" onClickAdd={this.onClickAdd} onChange={this.onChangeFilter} value={this.state.tags} />
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12 col-lg-4 last-lg top-lg">
                                <div className="row">
                                    <Top />
                                    <Trending />
                                </div>
                            </div>
                            <BlogList containerClassName="col-sm-12 col-lg-8" childClass={Card} subtype="blog" offset={0} limit={20} tags={this.state.tags} />
                        </div>
                    </div>
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
            canWriteToContainer(type: object, subtype: "blog")
        }
    }
`

export default graphql(Query)(List)