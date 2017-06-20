import React from "react"
import Modal from "../core/components/Modal"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import autobind from "autobind-decorator"

class Info extends React.Component {
    @autobind
    onClose(e) {
        this.props.history.push("/groups")
    }

    render() {
        const { entity } = this.props.data

        if (!entity) {
            return (
                <div />
            )
        }

        return (
            <Modal ref="modal" noParent={true} onClose={this.onClose}>
                <div className="group-info">
                    <div className="group-info__image" style={{backgroundImage: `url('${entity.icon}')`}} />
                    <div className="group-info__content">
                        <h3 className="main__title ___no-margin">{entity.name}</h3>
                        <div className="group-info__state">{entity.isClosed ? "Gesloten groep" : "Openbare groep"}</div>
                        <div className="group-info__title">Beschrijving</div>
                        <div className="group-info__description">{entity.description}</div>
                    </div>
                </div>
            </Modal>
        )
    }

    renderHelpText(message) {
        return (
            <span className="help-block">{message}</span>
        )
    }
}

const Query = gql`
    query GroupInfo($guid: String!) {
        viewer {
            guid
            loggedIn
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
                plugins
                description
                icon
                isClosed
                canEdit
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
                guid: ownProps.match.params.guid
            }
        }
    }
}

export default graphql(Query, Settings)(Info)