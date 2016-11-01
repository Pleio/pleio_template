import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import classnames from "classnames"

class ProfileField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isEditing: false,
            value: this.props.value || ""
        }

        this.onChange = (e) => this.setState({ value: e.target.value })
        this.onBlur = this.onBlur.bind(this)
        this.onClick = this.onClick.bind(this)
        this.onKeyPress = this.onKeyPress.bind(this)
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: nextProps.value
            })
        }
    }

    onClick(e) {
        if (!this.props.canEdit) {
            return
        }

        this.setState({
            isEditing: true
        })

        setTimeout(() => {
            this.refs.input.focus()
        }, 0)
    }

    onKeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : e.which
        if (keyCode !== 13) { // Enter button
            return;
        }

        this.submitField()
    }

    onBlur(e) {
        this.submitField()
    }

    submitField() {
        this.setState({
            isEditing: false
        })

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    key: this.props.dataKey,
                    value: this.state.value
                }
            }
        })
    }

    render() {
        switch (this.props.type) {
            case "textarea":
                return this.renderTextArea()
            case "h3":
                return this.renderH3()
            default:
                return this.renderTextField()
        }
    }

    renderTextField() {
        let input
        if (this.props.canEdit) {
            input = (
                <input type="text" ref="input" onChange={this.onChange} onKeyPress={this.onKeyPress} onBlur={this.onBlur} value={this.state.value} />
            )
        }

        return (
            <li>
                <label>{this.props.name}</label>
                <span className={classnames({"___is-editable": this.props.canEdit , "___is-editing": this.state.isEditing})}>
                    <span onClick={this.onClick}>{this.state.value}</span>
                    {input}
                </span>
            </li>
        )
    }

    renderH3() {
        let input
        if (this.props.canEdit) {
            input = (
                <input type="text" ref="input" onChange={this.onChange} onKeyPress={this.onKeyPress} onBlur={this.onBlur} value={this.state.value} />
            )
        }

        return (
            <h3 className={classnames({"main__title ___no-margin": true, "___is-editable": this.props.canEdit , "___is-editing": this.state.isEditing})}>
                <span onClick={this.onClick}>{this.state.value}</span>
                {input}
            </h3>
        )
    }

    renderTextArea() {
        return (
            <div></div>
        )
    }
}

const Query = gql`
    mutation editProfileField($input: editProfileFieldInput!) {
        editProfileField(input: $input) {
            user {
                guid
                name
                profile {
                    key
                    name
                    value
                }
            }
        }
    }
`

const withQuery = graphql(Query)
export default withQuery(ProfileField)