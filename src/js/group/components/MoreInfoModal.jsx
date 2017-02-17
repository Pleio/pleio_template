import React from "react"
import Modal from "../../core/components/NewModal"

export default class MoreInfoModal extends React.Component {
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
            <Modal ref="modal">
                <div className="group-info">
                    <div className="group-info__image" style={{backgroundImage: `url('${entity.icon}')`}} />
                    <div className="group-info__content">
                        <h3 className="main__title ___no-margin">{entity.name}</h3>
                        <div className="group-info__state">{entity.isClosed ? "Gesloten groep" : "Openbare groep"}</div>
                        <div className="group-info__title">Beschrijving</div>
                        <div className="group-info__description">{entity.description}</div>
                    </div>
                </div>
            </Modal>
        )
    }
}

