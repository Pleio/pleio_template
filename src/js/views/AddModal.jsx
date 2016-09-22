import React from "react"
import ReactDOM from "react-dom"
import { connect } from "react-redux"
import { hideModal } from "../lib/actions"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import Errors from "../components/Errors"
import Modal from "../components/Modal"
import RichText from "../components/RichText"
import AccessSelect from "../containers/AccessSelect"
import { stringToTags } from "../lib/helpers"

class AddModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: null,
            title: "",
            description: "",
            tags: []
        }

        this.onChangeTitle = (e) => this.setState({title: e.target.value})
        this.onChangeDescription = (e) => this.setState({description: e.target.value})
        this.onChangeTags = (e) => this.setState({tags: e.target.value})

        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            errors: null
        })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    type: "object",
                    subtype: "news",
                    title: this.state.title,
                    description: this.state.description,
                    tags: stringToTags(this.state.tags)
                }
            },
            refetchQueries: ["NewsList"]
        }).then(({data}) => {
            this.props.dispatch(hideModal())
        }).catch((errors) => {
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        return (
            <Modal id="add" title={this.props.title}>
                <form className="form" onSubmit={this.onSubmit}>
                    <label className="form__item">
                        <input type="text" placeholder="Titel" className="form__input" onChange={this.onChangeTitle} value={this.state.title} />
                    </label>
                    <label className="form__item">
                        <textarea placeholder="Beschrijving" onChange={this.onChangeDescription} value={this.state.description} />
                    </label>
                    <label className="form__item">
                        <input type="text" placeholder="Tags" className="form__input" onChange={this.onChangeTags} value={this.state.tags} />
                    </label>

                    <button className="button">Toevoegen</button>
                </form>
            </Modal>
        )
    }
}

const ADD = gql`
    mutation addEntity($input: addEntityInput!) {
        addEntity(input: $input) {
            entity {
                guid
            }
        }
    }
`
const withAdd = graphql(ADD)
export default connect()(withAdd(AddModal))