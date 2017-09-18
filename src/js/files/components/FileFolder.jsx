import React from "react"
import PropTypes from "prop-types"
import showDate from "../../lib/showDate"
import CheckField from "../../core/components/CheckField"
import autobind from "autobind-decorator"
import classnames from "classnames"

class FileFolder extends React.Component {
    @autobind
    onCheck(e) {
        const { entity, selected } = this.props
        this.context.onCheck(entity, !selected.has(entity))
    }

    @autobind
    onClick(e) {
        e.preventDefault()

        const { group } = this.context
        const { entity } = this.props
        if (entity.subtype === "file") {
            window.location.href = `/file/download/${entity.guid}`
        } else {
            this.context.clearSelection()
            this.props.history.push(`/groups/view/${group.guid}/${group.name}/files/${entity.guid}`)
        }
    }

    render () {
        const { onCheck, group } = this.context
        const { entity, selected } = this.props

        let link
        switch (entity.subtype) {
            case "file":
                link = `/file/download/${entity.guid}`
                break;
            case "folder":
                link = `/groups/view/${group.guid}/${group.name}/files/${entity.guid}`
                break;
        }

        let checkbox
        if (entity.canEdit) {
            checkbox = (
                <span className="checkbox ___large">
                    <input id={`file-${entity.guid}`} name={`file-${entity.guid}`} type="checkbox" onClick={this.onCheck} checked={selected.has(entity)} />
                    <label htmlFor={`file-${entity.guid}`} />
                </span>
            )
        }

        return (
            <tr className={classnames({"file": true, "___is-checked": selected.has(entity)})}>
                <td className="file__check">{checkbox}</td>
                <td className={classnames({"file__type": true, "___folder": entity.subtype === "folder", "___doc": entity.subtype === "file"})}></td>
                <td className="file__name">
                    <a href={link} onClick={this.onClick}>{entity.title}</a>
                </td>
                <td className="file__fav"></td>
                <td className="file__date">{showDate(entity.timeCreated)}</td>
                <td className="file__owner">{entity.owner.name}</td>
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