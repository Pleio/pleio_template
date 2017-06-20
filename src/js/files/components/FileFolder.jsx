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

        let subtype
        if (entity.subtype === "folder") {
            subtype = (
                <span className="file__icon" style={{marginRight:"0.5em"}}>
                    <svg version="1.1" x="0px" y="0px" width="16px" height="12.8px" viewBox="0 0 16 12.8">
                        <path style={{fill:"#B4B4B4"}} d="M6.4,0H1.6C0.7,0,0,0.7,0,1.6l0,9.6c0,0.9,0.7,1.6,1.6,1.6h12.8c0.9,0,1.6-0.7,1.6-1.6v-8c0-0.9-0.7-1.6-1.6-1.6H8L6.4,0z"/>
                    </svg>
                </span>
            )
        } else {
            subtype = (
                <span className="file__icon" style={{marginRight:"0.5em"}}>
                    <svg version="1.1" x="0px" y="0px" width="12.8px" height="16px" viewBox="0 0 12.8 16">
                        <path style={{fill:"#009FE3"}} d="M1.6,0C0.7,0,0,0.7,0,1.6l0,12.8C0,15.3,0.7,16,1.6,16h9.6c0.9,0,1.6-0.7,1.6-1.6V4.8L8,0H1.6z"/>
                    </svg>
                </span>
            )
        }

        return (
            <div className={classnames({"row file__item": true, "___selected": selected.has(entity)})}>
                <div className="col-sm-8">
                    {checkbox}
                    {subtype}
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