import React from "react"
import NotFound from "../core/NotFound"
import EditCore from "../core/Edit"
import DeleteCore from "../core/Delete"
import Modal from "../core/components/Modal"
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
        const { entity } = this.props.data
        this.props.history.push(`${this.getRootURL()}/wiki/view/${entity.guid}/${entity.title}`)
    }

    afterEdit() {
        const { entity } = this.props.data
        window.location.href = `${this.getRootURL()}/wiki/view/${entity.guid}/${entity.title}`
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
                <Modal title="Wiki wijzigen" full={true} noParent={true} />
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        return (
            <Modal title="Wiki wijzigen" full={true} noParent={true} onClose={this.onClose}>
                <EditCore subtype="wiki" entity={entity} afterEdit={this.afterEdit} onDeleteClick={this.onDeleteClick} />
                <DeleteCore title="Wiki verwijderen" ref="deleteModal" entity={entity} afterDelete={this.afterDelete} />
            </Modal>
        )
    }
}

const Query = gql`
    query EditWiki($guid: String!) {
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
                featuredImage
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