import React from "react"
import NotFound from "../core/NotFound"
import EditCore from "../core/Edit"
import DeleteCore from "../core/Delete"
import ActionContainer from "../core/components/ActionContainer"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class Edit extends React.Component {
    constructor(props) {
        super(props)

        this.onClose = this.onClose.bind(this)
        this.afterEdit = this.afterEdit.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
        this.afterDelete = this.afterDelete.bind(this)
    }

    getRootURL() {
        const { match } = this.props

        if (match.params.groupGuid && match.params.groupSlug) {
            return `/groups/view/${match.params.groupGuid}/${match.params.groupSlug}`
        }

        return ""
    }

    onClose() {
        const { history } = this.props
        history.goBack()
    }

    afterEdit() {
        const { history } = this.props
        history.goBack()
    }

    afterDelete() {
        window.location.href = `${this.getRootURL()}/wiki`
    }

    onDeleteClick(e) {
        e.preventDefault()
        this.refs.deleteModal.toggle()
    }

    render() {
        let { entity } = this.props.data

        if (!entity) {
            return (
                <div />
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        return (
            <ActionContainer title="Wiki wijzigen" full={true} noParent={true} onClose={this.onClose}>
                <EditCore subtype="wiki" entity={entity} afterEdit={this.afterEdit} onDeleteClick={this.onDeleteClick} />
                <DeleteCore title="Wiki verwijderen" ref="deleteModal" entity={entity} afterDelete={this.afterDelete} />
            </ActionContainer>
        )
    }
}

const Query = gql`
    query EditWiki($guid: Int!) {
        entity(guid: $guid) {
            guid
            status
            ... on Object {
                title
                description
                richDescription
                url
                accessId
                timeCreated
                source
                isFeatured
                featured {
                    image
                    video
                    positionY
                }
                canEdit
                tags
                isBookmarked
                canBookmark
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

export default graphql(Query, Settings)(Edit)