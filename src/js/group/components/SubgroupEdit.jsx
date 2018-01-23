import React from "react"
import autobind from "autobind-decorator"
import Form from "../../core/components/Form"
import InputField from "../../core/components/InputField"
import Errors from "../../core/components/Errors"
import { logErrors } from "../../lib/helpers"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import MembersList from "../components/MembersList"
import { Set } from "immutable"

class SubgroupEdit extends React.Component {
    constructor(props) {
        super(props)

        const { subgroup } = this.props

        this.state = {
            errors: [],
            selected: subgroup ? new Set(subgroup.members.map((member) => member.guid)) : new Set(),
            name: subgroup ? subgroup.name : ""
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props) {
            return
        }

        this.setState({
            selected: nextProps.subgroup ? new Set(nextProps.subgroup.members.map((member) => member.guid)) : new Set(),
            name: nextProps.subgroup ? nextProps.subgroup.name : ""
        })
    }

    @autobind
    onSelect(e, guid) {
        if (!this.state.selected.has(guid)) {
            this.setState({ selected: this.state.selected.add(guid) })
        } else {
            this.setState({ selected: this.state.selected.delete(guid) })
        }
    }

    @autobind
    onSubmit(e) {
        const { entity, subgroup } = this.props

        this.setState({
            errors: []
        })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    id: subgroup.id,
                    name: this.refs.name.getValue(),
                    members: this.state.selected.toJS()
                }
            },
            refetchQueries: ["SubgroupsList"]
        }).then(({data}) => {
            this.props.toggle()
        }).catch((errors) => {
            logErrors(errors)
            this.setState({
                errors: errors
            })
        })
    }

    render() {
        const { entity } = this.props

        return (
            <div>
                <div className="form">
                    <Errors errors={this.state.errors} />
                    <InputField ref="name" label="Naam" name="name" type="text" placeholder="Naam" className="form__input" rules="required" value={this.state.name} />
                </div>

                <div className="group-info">
                    <div className="group-info__content ___scrollable" style={{maxHeight:"17em"}}>
                        <MembersList
                            entity={entity}
                            q={this.state.search}
                            onSelect={this.onSelect}
                            selected={this.state.selected}
                            selectable
                            scrollable
                        />
                    </div>
                </div>

                <div className="buttons ___margin-top">
                    <button className="button" type="submit" onClick={this.onSubmit}>Opslaan</button>
                </div>
            </div>
        )
    }
}

const Mutation = gql`
    mutation SubgroupEdit($input: editSubgroupInput!) {
        editSubgroup(input: $input) {
            success
        }
    }
`

export default graphql(Mutation)(SubgroupEdit)