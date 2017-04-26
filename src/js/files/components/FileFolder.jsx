import React from "react"
import PropTypes from "prop-types"
import showDate from "../../lib/showDate"
import CheckField from "../../core/components/CheckField"
import classnames from "classnames"

class FileFolder extends React.Component {
    constructor(props) {
        super(props)

        this.onCheck = this.onCheck.bind(this)
        this.onClick = this.onClick.bind(this)
    }

    onCheck(e) {
        const { entity, selected } = this.props
        this.context.onCheck(entity, !selected.has(entity))
    }

    onClick(e) {
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

        let checkbox
        if (entity.canEdit) {
            checkbox = (
                <div className="file__check">
                    <CheckField name={entity.guid} onChange={this.onCheck} checked={selected.has(entity)} />
                </div>
            )
        }

        return (
            <div className="row file__item">
                <div className="col-sm-1">
                    {checkbox}
                </div>
                <div className="col-sm-1">
                    {entity.subtype}
                </div>
                <div className="col-sm-6">
                    <a href="javascript:void(0);" onClick={this.onClick}>
                        {entity.title}
                    </a>
                </div>
                <div className="col-sm-2">
                    {showDate(entity.timeCreated)}
                </div>
                <div className="col-sm-2">
                    {entity.owner.name}
                </div>
            </div>
        )
    }
}

FileFolder.contextTypes = {
    onCheck: PropTypes.func,
    clearSelection: PropTypes.func,
    group: PropTypes.object
}

export default FileFolder