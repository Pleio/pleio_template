import React from "react"
import Modal from "../core/components/Modal"
import Errors from "../core/components/Errors"
import LoggedInButton from "../core/components/LoggedInButton"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import autobind from "autobind-decorator"
import { logErrors } from "../lib/helpers"

class Info extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }
    @autobind
    onClose(e) {
        this.props.history.push("/groups")
    }

    @autobind
    requestAccess(e) {
        const { entity } = this.props.data

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: entity.guid
                }
            }
        }).catch((errors) => {
            logErrors(errors)
            this.setState({ errors: errors })
        })
    }

    render() {
        const { entity, viewer } = this.props.data

        if (!entity) {
            return (
                <div />
            )
        }

        let requestAccess
        if (entity.isClosed) {
            switch (entity.membership) {
                case "not_joined":
                    requestAccess = (
                        <p>
                            <LoggedInButton className="button" onClick={this.requestAccess} viewer={viewer}>Vraag lidmaatschap aan</LoggedInButton>
                        </p>
                    )
                    break
                case "requested":
                    requestAccess = (
                        <p><b>Lidmaatschap is aangevraagd, wacht op goedkeuring van de groepsbeheerder.</b></p>
                    )
                    break
                case "joined":
                    requestAccess = (
                        <div>
                            <p>Je bent lid van deze groep.</p>
                            <button className="button" onClick={(e) => window.location = entity.url}>Ga naar de groep</button>
                        </div>
                    )
            }
        }

        let errors
        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        return (
            <Modal ref="modal" noParent={true} onClose={this.onClose}>
                <div className="group-info">
                    <div className="group-info__image" style={{backgroundImage: `url('${entity.icon}')`}} />
                    <div className="group-info__content">
                        <h3 className="main__title ___no-margin">{entity.name}</h3>
                        <div className="group-info__state">{entity.isClosed ? "Gesloten groep" : "Openbare groep"}</div>
                        <div className="group-info__title">Beschrijving</div>
                        <div className="group-info__description">
                            {entity.description}
                        </div>
                        <div className="group-info__access">
                            {errors}
                            {requestAccess}
                        </div>
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
    query GroupInfo($guid: Int!) {
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
                url
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

const Mutation = gql`
    mutation GroupInfo($input: joinGroupInput!) {
        joinGroup(input: $input) {
            group {
                guid
                membership
            }
        }
    }
`

export default graphql(Mutation)(graphql(Query, Settings)(Info))