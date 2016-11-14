import React from "react"
import classnames from "classnames"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

class DeleteWidgetModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.toggle = () => this.setState({ isOpen: !this.state.isOpen })
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({errors: null})

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid
                }
            },
            refetchQueries: ["PageItem"]
        }).then(({data}) => {
            this.setState({
                isOpen: false
            })
        })
    }

    render() {
        return (
            <div tabIndex="0" className={classnames({"modal ___small ___middle": true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background"></div>
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle}></div>
                        <h3 className="modal__title">Verwijderen</h3>
                        <form className="form" onSubmit={this.onSubmit}>
                            <p>Weet je zeker dat je dit widget wil verwijderen?</p>
                            <button className="button" type="submit">Verwijder</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const Delete = gql`
    mutation deleteEntity($input: deleteEntityInput!) {
        deleteEntity(input: $input) {
            entity {
                guid
                ... on Object {
                    status
                }
            }
        }
    }
`
const withDelete = graphql(Delete, {
    withRef: "true"
})

export default withDelete(DeleteWidgetModal)