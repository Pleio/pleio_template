import React from "react"
import { Set } from "immutable"
import autobind from "autobind-decorator"
import Modal from "../../core/components/NewModal"
import SubgroupEdit from "./SubgroupEdit"

export default class SubgroupEditModal extends React.Component {
    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render () {
        const { entity, subgroup } = this.props

        return (
            <Modal ref="modal" title="Subgroep bewerken" square>
                <SubgroupEdit entity={entity} subgroup={subgroup} toggle={this.toggle} />
            </Modal>
        )
    }
}

