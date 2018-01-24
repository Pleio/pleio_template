import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import GroupContainer from "../group/components/GroupContainer"
import JoinGroupButton from "../group/components/JoinGroupButton"
import Document from "../core/components/Document"
import Modal from "../core/components/NewModal"
import AddCore from "../core/Add"
import WikiItem from "../wiki/Item"

class GroupItem extends React.Component {
    render() {
        const { match } = this.props
        const { viewer } = this.props.data

        if (!viewer) {
            // Loading...
            return (
                <div></div>
            )
        }

        let add
        if (viewer.canWriteToContainer) {
            add = (
                <div className="buttons ___no-margin ___gutter ___hide-on-tablet">
                    <div className="button ___large ___add" onClick={(e) => this.refs.addModal.toggle()}><span>Maak een subpagina</span></div>
                </div>
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
                {add}
                {join}
            </div>
        )

        return (
            <GroupContainer buttons={buttons} match={this.props.match}>
                <section className="section ___grow">
                    <WikiItem match={this.props.match} />
                    <Modal ref="addModal" full title="Subpagina toevoegen">
                        <AddCore subtype="wiki" afterAdd={() => location.reload()} containerGuid={match.params.containerGuid || match.params.guid} />
                    </Modal>
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
            canWriteToContainer(containerGuid: $guid, type: object, subtype: "wiki")
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
                guid
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

export default graphql(Query, Settings)(GroupItem)