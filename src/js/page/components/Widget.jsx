import React from "react"
import Leader from "./widgets/Leader"
import Recommended from "./widgets/Recommended"
import Text from "./widgets/Text"
import Trending from "./widgets/Trending"
import Top from "./widgets/Top"
import EditWidgetModal from "./EditWidgetModal"
import DeleteWidgetModal from "./DeleteWidgetModal"

export default class Widget extends React.Component {
    constructor(props) {
        super(props)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.toggleDelete = this.toggleDelete.bind(this)
    }

    toggleEdit(e) {
        e.preventDefault()
        this.refs.editModal.toggle()
    }

    toggleDelete(e) {
        e.preventDefault()
        this.refs.editModal.toggle()
        this.refs.deleteModal.getWrappedInstance().toggle()
    }

    render() {
        const { entity } = this.props
        let content, width

        switch (entity.type) {
            case "Leader":
                width = "col-sm-12"
                content = ( <Leader entity={entity} /> )
                break
            case "Recommended":
                width = "col-sm-4"
                content = ( <Recommended entity={entity} /> )
                break
            case "Trending":
                width = "col-sm-4"
                content = ( <Trending entity={entity} /> )
                break
            case "Top":
                width = "col-sm-4"
                content = ( <Top entity={entity} /> )
                break
            case "Text":
                width = "col-sm-4"
                content = ( <Text entity={entity} /> )
                break
            default:
                width = "col-sm-4"
                content = ( <div>Kon widget niet aanmaken.</div> )
        }

        return (
            <div className={"widget " + width}>
                {content}
                <div className="widget__admin">
                    <a href="#" onClick={this.toggleEdit}>Edit</a>
                </div>
                <EditWidgetModal ref="editModal" entity={entity} toggleDelete={this.toggleDelete} />
                <DeleteWidgetModal ref="deleteModal" entity={entity} />
            </div>
        )
    }
}