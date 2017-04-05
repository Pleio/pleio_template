import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import MembersList from "../components/MembersList"

export default class MembersModal extends React.Component {
    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.onChange = this.onChange.bind(this)

        this.state = {
            q: ""
        }
    }

    onChange(e) {
        this.setState({ q: e.target.value })
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render () {
        const { entity } = this.props

        return (
            <Modal ref="modal" title="Leden">
                <div className="group-info">
                    <div className="group-info__content">
                        <MembersList entity={entity} />
                    </div>
                </div>
            </Modal>
        )
    }
}

