import React from "react"
import Modal from "../../core/components/NewModal"

export default class DeleteModal extends React.Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    toggle() {
        this.refs.modal.toggle()
    }

    onDelete() {
        //Delete de groep
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
                        <div className="group-info__title">Bevestiging</div>
                        <div className="group-info__description">Weet u zeker dat u deze groep wilt verwijderen?</div>
                        <button className="button" type="submit" name="delete">
                            Verwijderen
                        </button>
                        <button onClick={this.toggle} className="button">
                            Annuleren
                        </button>
                    </div>
                </div>
            </Modal>
        )
    }
}

/*
const Mutation = gql`
    mutation deleteEntity($input: deleteEntityInput!) {
        deleteEntity(input: $input) {
            guid
        }
    }
`
*/