import React from "react"
import Form from "../../core/components/Form"
import TextField from "../../core/components/TextField"
import autobind from "autobind-decorator"
import { graphql } from "react-apollo"
import gql from "graphql-tag"

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
            subtype: "thewire",
            description: values.description,
            containerGuid: this.props.containerGuid
        }

        this.props.mutate({
            variables: {
                input
            }
        }).then(({data}) => {
            window.location.href = "/groups"
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })

    }

    render() {
        const { viewer } = this.props.data

        let icon
        if (viewer) {
            icon = (
                <div className="picture" style={{backgroundImage:`url(${viewer.user.icon})`}} />
            )
        }

        return (
            <div className="card ___indent">
                {icon}
                <div className="card__content">
                    <Form ref="form" onSubmit={this.onSubmit} className="form">
                        <TextField name="description" placeholder="Deel een tip of update" />
                    </Form>
                    <div className="flexer ___end ___gutter">
                        <button className="button" type="submit">Plaatsen</button>
                    </div>
                </div>
            </div>
        )
    }
}

const Query = gql`
    query addStatusUpdate {
        viewer {
            guid
            user {
                guid
                icon
            }
        }
    }
`

const Mutation = gql`
    mutation addStatusUpdate($input: addStatusUpdateInput!) {
        addEntity(input: $input) {
            entity {
                guid
                description
            }
        }
    }
`

export default graphql(Mutation)(graphql(Query)(StatusUpdate))