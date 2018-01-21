import React from "react"
import Modal from "../../core/components/NewModal"
import MembershipRequestsList from "./MembershipRequestsList"
import autobind from "autobind-decorator"

export default class MembershipRequestsModal extends React.Component {
    @autobind
    toggle() {
        this.refs.modal.toggle()
    }

    render() {
        return (
            <Modal ref="modal" title="Toegangsaanvragen">
                <div className="group-info">
                    <div className="group-info__content">
                        <MembershipRequestsList group={this.props.entity} />
                    </div>
                </div>
            </Modal>
        )
    }
}