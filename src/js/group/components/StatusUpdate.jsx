import React from "react"
import Form from "../../core/components/Form"
import RichTextField from "../../core/components/RichTextField"
import Errors from "../../core/components/Errors"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import { logErrors } from "../../lib/helpers"
import { convertToRaw } from "draft-js"

class StatusUpdate extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            errors: []
        }
    }

    @autobind
    onSubmit(e) {
        this.setState({
            errors: []
        })

        const values = this.refs.form.getValues()

        let input = {
            clientMutationId: 1,
            type: "object",
            subtype: "thewire",
            description: values.description.getPlainText(),
            richDescription: JSON.stringify(convertToRaw(values.description)),
            containerGuid: this.props.containerGuid
        }

        this.props.mutate({
            variables: {
                input
            },
            refetchQueries: ["GroupActivityList"]
        }).then(({data}) => {
            this.refs.form.clearValues()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })

    }

    render() {
        const { viewer } = this.props

        let errors
        if (this.state.errors) {
            errors = ( <Errors errors={this.state.errors} /> );
        }

        return (
            <div className="card ___indent">
                <div className="picture" style={{backgroundImage:`url(${viewer.user.icon})`}} />
                <div className="card__content">
                    {errors}
                    <Form ref="form" onSubmit={this.onSubmit} className="form">
                        <RichTextField name="description" placeholder="Deel een tip of update" minimal rules="required" />
                        <div className="flexer ___end ___gutter">
                            <button className="button" type="submit">Plaatsen</button>
                        </div>
                    </Form>
                </div>
            </div>
        )
    }
}

const Mutation = gql`
    mutation addStatusUpdate($input: addEntityInput!) {
        addEntity(input: $input) {
            entity {
                guid
                ... on Object {
                    description
                }
            }
        }
    }
`

export default graphql(Mutation)(StatusUpdate)
