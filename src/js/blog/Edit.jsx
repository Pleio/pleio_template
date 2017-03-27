import React from "react"
import NotFound from "../core/NotFound"
import EditCore from "../core/Edit"
import DeleteCore from "../core/Delete"
import Modal from "../core/components/Modal"
import { graphql } from "react-apollo"
import { browserHistory } from "react-router"
import gql from "graphql-tag"

class Edit extends React.Component {
    constructor(props) {
        super(props)

        this.onClose = this.onClose.bind(this)
        this.afterEdit = this.afterEdit.bind(this)
        this.onDeleteClick = this.onDeleteClick.bind(this)
    }

    onClose() {
        const { entity } = this.props.data
        browserHistory.push(entity.url)
    }

    afterEdit() {
        const { entity } = this.props.data
        window.location.href = entity.url
    }

    afterDelete() {
        window.location.href = "/blog"
    }

    onDeleteClick(e) {
        e.preventDefault()
        this.refs.deleteModal.toggle()
    }

    render() {
        let { entity, viewer } = this.props.data

        if (!entity) {
            return (
                <Modal title="Blog wijzigen" full={true} noParent={true} />
            )
        }

        if (entity.status == 404) {
            return (
                <NotFound />
            )
        }

        return (
            <Modal title="Blog wijzigen" full={true} noParent={true} onClose={this.onClose}>
                <EditCore subtype="blog" viewer={viewer} entity={entity} featuredImage={true} refetchQueries={["InfiniteList"]} afterEdit={this.afterEdit} onDeleteClick={this.onDeleteClick} />
                <DeleteCore title="Blog verwijderen" ref="deleteModal" entity={entity} afterDelete={this.afterDelete} />
            </Modal>
        )
    }
}

const Query = gql`
    query EditNews($guid: String!) {
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
                guid: ownProps.params.guid
            }
        }
    }
}

export default graphql(Query, Settings)(Edit)