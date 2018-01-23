import React from "react"
import autobind from "autobind-decorator"
import Modal from "../../core/components/NewModal"
import SubgroupAdd from "./SubgroupAdd"
import SubgroupsList from "./SubgroupsList"
import SubgroupEditModal from "./SubgroupEditModal"

export default class SubgroupsModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: [],
            subgroup: null
        }
    }

    @autobind
    editSubgroup(subgroup) {
        this.setState({ subgroup })
        this.refs.subgroupEditModal.toggle()
    }

    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render () {
        const { entity } = this.props

        return (
            <Modal ref="modal" title="Subgroepen" square>
                <SubgroupAdd entity={entity} />
                <div className="group-info">
                    <div className="group-info__content ___scrollable">
                        <SubgroupsList entity={entity} editSubgroup={this.editSubgroup} scrollable />
                    </div>
                </div>
                <SubgroupEditModal ref="subgroupEditModal" entity={entity} subgroup={this.state.subgroup} />
            </Modal>
        )
    }
}