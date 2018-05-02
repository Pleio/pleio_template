import React from "react"
import ReactDOM from "react-dom"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import classnames from "classnames"

class CommentDelete extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.toggle = this.toggle.bind(this)
    }

    toggle() {
        this.setState({ isOpen: !this.state.isOpen })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.entity) {
            this.setState(nextProps.entity)
        }
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
            refetchQueries: this.props.refetchQueries
        }).then(({data}) => {
            location.reload()
        })
    }

    render() {
        let title = ""

        if (this.props.entity) {
            if (this.props.entity.title) {
                title = this.props.entity.title
            }

            if (this.props.entity.name) {
                name = this.props.entity.name
            }
        }

        return (
            <div id={this.props.id} tabIndex="0" className={classnames({"modal ___small":true, "___is-open": this.state.isOpen})}>
                <div className="modal__wrapper">
                    <div className="modal__background" />
                    <div className="modal__box">
                        <div className="modal__close" onClick={this.toggle} />
                        <h3 className="modal__title">
                            Reactie verwijderen
                        </h3>
                        <p>Weet je zeker dat je het item {title} wil verwijderen?</p>
                        <button className="button" onClick={this.onSubmit}>Verwijder</button>
                    </div>
                </div>
            </div>
        )
    }
}

const Mutation = gql`
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
const withMutation = graphql(Mutation, {
    withRef: 'true'
})

export default withMutation(CommentDelete)