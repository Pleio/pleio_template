import React from "react"
import { Link } from "react-router-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import ContentHeader from "../core/components/ContentHeader"
import Document from "../core/components/Document"
import GroupsList from "./containers/GroupsList"
import Card from "./components/Card"

class List extends React.Component {
    render() {
        const { viewer } = this.props.data

        let add
        if (viewer && viewer.canWriteToContainer) {
            add = (
                <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                    <Link to={`groups/add`} className="right-lg">
                        <div className="button ___large ___add"><span>Maak een groep</span></div>
                    </Link>
                </div>
            )
        }

        return (
            <div className="page-container">
                <Document title="Groepen" />
                <ContentHeader>
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title">
                                Groepen
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            {add}
                        </div>
                    </div>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                            </div>
                        </div>
                        <GroupsList type="group" containerClassName="" rowClassName="row" childClass={Card} offset={0} limit={20} />
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
            canWriteToContainer(type: group)
        }
    }
`

export default graphql(Query)(List)