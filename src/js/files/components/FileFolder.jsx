import React from "react"
import PropTypes from "prop-types"
import showDate from "../../lib/showDate"
import CheckField from "../../core/components/CheckField"
import AccessField from "../../core/components/AccessField"
import autobind from "autobind-decorator"
import classnames from "classnames"

class FileFolder extends React.Component {

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
        const { entity } = this.props

        if (entity.subtype !== "folder") {
            return
        }

        e.preventDefault()

        const { group } = this.context

        this.context.clearSelection()
        this.props.history.push(`/groups/view/${group.guid}/${group.name}/files/${entity.guid}`)
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

        let className
        if (entity.subtype === "folder") {
            className = "___folder"
        } else if (entity.mimeType.indexOf("image/") !== -1) {
            className = "___img"
        } else if (entity.mimeType.indexOf("application/pdf") !== -1) {
            className = "___pdf"
        } else {
            className = "___doc"
        }

        return (
            <tr className={classnames({"file": true, "___is-checked": selected.has(entity)})}>
                <td className="file__check">{checkbox}</td>
                <td className={classnames({"file__type": true, [className]: true})}></td>
                <td className="file__name">
                    <a href={this.getLink()} onClick={this.onClick}>{entity.title}</a>
                    <span>{entity.title}</span>
                </td>
                <td className="file__fav"></td>
                <td className="file__date">{showDate(entity.timeCreated)}</td>
                <td className="file__owner"><AccessField readOnly value={entity.accessId} /></td>
                <td className="file__owner"><AccessField readOnly value={entity.writeAccessId} /></td>
            </tr>
        )
    }
}

FileFolder.contextTypes = {
    onCheck: PropTypes.func,
    clearSelection: PropTypes.func,
    group: PropTypes.object
}

export default FileFolder