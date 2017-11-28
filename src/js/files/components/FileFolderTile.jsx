import React from "react"
import PropTypes from "prop-types"
import showDate from "../../lib/showDate"
import CheckField from "../../core/components/CheckField"
import autobind from "autobind-decorator"
import classnames from "classnames"

class FileFolderTile extends React.Component {
    @autobind
    getLink() {
        const { group } = this.context
        const { entity } = this.props

        if (entity.subtype == "file") {
            if (entity.mimeType == "application/vnd.oasis.opendocument.text") {
                return `/file/view/${entity.guid}`
            } else {
                return `/file/download/${entity.guid}/${entity.title}`
            }
        } else {
            return `/groups/view/${group.guid}/${group.name}/files/${entity.guid}`
        }
    }

    @autobind
    onCheck(e) {
        const { entity, selected } = this.props
        this.context.onCheck(entity, !selected.has(entity))
    }

    @autobind
    onClick(e) {
        e.preventDefault()

        const { entity, selected } = this.props
        const { group } = this.context

        if (entity.subtype === "folder") {
            this.context.clearSelection()
            this.props.history.push(`/groups/view/${group.guid}/${group.name}/files/${entity.guid}`)    
        } else {
            window.location = this.getLink()
        }
    }

    render () {
        const { onCheck, group } = this.context
        const { entity, selected } = this.props

        let checkbox
        if (entity.canEdit) {
            checkbox = (
                <span className="checkbox ___large">
                    <input id={`file-${entity.guid}`} name={`file-${entity.guid}`} type="checkbox" onClick={this.onCheck} checked={selected.has(entity)} />
                    <label htmlFor={`file-${entity.guid}`} />
                </span>
            )
        }

        let className, style
        if (entity.subtype === "folder") {
            className = "___folder"
        } else if (entity.mimeType.indexOf("image/") !== -1) {
            className = "___img"
            style = {backgroundImage: `url(${entity.thumbnail})`}
        } else if (entity.mimeType.indexOf("application/pdf") !== -1) {
            className = "___pdf"
        } else {
            className = "___doc"
        }

        return (
            <div className={classnames({"file-tile": true, "___is-checked": selected.has(entity), [className]: true})} onDoubleClick={this.onClick}>
                <div className="file-tile__image" style={style}>
                    {checkbox}
                </div>
                <div className="file-tile__name">
                    <span>{entity.title}</span>
                    <span>{entity.title}</span>
                </div>
            </div>
        )
    }
}

FileFolderTile.contextTypes = {
    onCheck: PropTypes.func,
    clearSelection: PropTypes.func,
    group: PropTypes.object
}

export default FileFolderTile