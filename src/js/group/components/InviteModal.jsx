import React from "react"
import Modal from "../../core/components/NewModal"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import MembersList from "../components/MembersList"

export default class InviteModal extends React.Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.refs.modal.toggle()
    }

    render () {
        const { entity } = this.props

        return (
            <Modal ref="modal" className="modal__box">
                <div className="group-info">
                    <div className="group-info__image" style={{backgroundImage: `url('${entity.icon}')`}} />
                    <div className="group-info__content">
                        <h3 className="main__title ___no-margin">Leden beheer voor groep {entity.name}</h3>
                        <div className="search-bar ___margin-bottom">
                            <InputField placeholderText="Contacten zoeken" />
                            <div className="search-bar__button" />
                        </div>
                        <MembersList entity={entity} />
                    </div>
                </div>
            </Modal>
        )
    }
}

