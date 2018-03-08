import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import autobind from "autobind-decorator"
import { Link } from "react-router-dom"
import GroupContainer from "../group/components/GroupContainer"
import JoinGroupButton from "../group/components/JoinGroupButton"
import Document from "../core/components/Document"
import Select from "../core/components/NewSelect"
import EventsGroupList from "./containers/EventsGroupList"
import Card from "./components/Card"

class GroupList extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            filter: "upcoming"
        }
    }

    @autobind
    onChange(value) {
        this.setState({ filter: value })
    }

    render() {
        const { entity, viewer } = this.props.data

        if (!entity) {
            // Loading...
            return (
                <div></div>
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        let add
        if (viewer.canWriteToContainer) {
            add = (
                <Link to={`events/add`} className="button ___add ___large ___margin-mobile-top ___margin-bottom">
                    Voeg agenda-item toe
                </Link>
            )
        }

        let join
        if (((viewer.loggedIn && !entity.isClosed) || entity.canEdit) && entity.membership === "not_joined") {
            join = (
                <JoinGroupButton entity={entity} />
            )
        }

        const buttons = (
            <div className="flexer ___gutter ___top">
                {join}
            </div>
        )

        return (
            <GroupContainer match={this.props.match} buttons={buttons}>
                <Document title={entity.name} />
                <section className="section ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                                <Select name="filter" options={{ upcoming: "Aankomend", previous: "Afgelopen" }} onChange={this.onChange} value={this.state.filter} />
                            </div>
                            <div className="col-sm-8 end-sm col-lg-9">
                                {add}
                            </div>
                        </div>
                    </div>
                    <EventsGroupList filter={this.state.filter} containerGuid={entity.guid} childClass={Card} offset={0} limit={20} inGroup />
                </section>
            </GroupContainer>
        )
    }
}

const Query = gql`
    query GroupItem($guid: Int!) {
        viewer {
            guid
            loggedIn
            canWriteToContainer(containerGuid: $guid, type: object, subtype: "event")
            user {
                guid
                name
                icon
                url
            }
        }
        entity(guid: $guid) {
            guid
            status
            ... on Group {
                name
                description
                canEdit
                plugins
                icon
                isClosed
                membership
                members(limit: 5) {
                    total
                    edges {
                        role
                        email
                        user {
                            guid
                            username
                            url
                            name
                            icon
                        }
                    }
                }
            }
        }
    }
`

const Settings = {
    options: (ownProps) => {
        return {
            variables: {
                guid: ownProps.match.params.groupGuid
            }
        }
    }
}

export default graphql(Query, Settings)(GroupList)