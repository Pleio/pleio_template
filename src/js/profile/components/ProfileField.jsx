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
        // do not save an empty h3 field
        if (this.props.type == "h3" && !this.state.value) {
            return
        }

        this.setState({
            isEditing: false
        })

        if (this.isMutating) {
            return
        }

        this.isMutating = true

        this.props.mutate({
            variables: {
                input: {
                    clientMutationId: 1,
                    guid: this.props.entity.guid,
                    key: this.props.dataKey,
                    value: this.state.value
                }
            }
        }).then((data) => {
            this.isMutating = false
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
        if (!this.props.canEdit) {
            return (
                <li>
                    <label>{this.props.name}</label>
                    <span>{this.props.value}</span>
                </li>
            )
        }

        let fillNow
        if (!this.state.value && !this.state.isEditing) {
            fillNow = (
                <div className="card-profile__fill">Meteen invullen</div>
            )
        }

        return (
            <li>
                <label>{this.props.name}</label>
                <span className={classnames({"___is-editable-field": true, "___is-editing": this.state.isEditing, "___is-empty": !this.state.value})} onClick={this.onClick}>
                    <span className="editable-field">{this.state.value || "..."}</span>
                    {fillNow}
                    <input type="text" ref="input" onChange={this.onChange} onKeyPress={this.onKeyPress} onBlur={this.onBlur} value={this.state.value || ""} />
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
            <h3 className={classnames({"main__title ___no-margin": true, "___is-editable-field": this.props.canEdit , "___is-editing": this.state.isEditing})}>
                <div className="editable-field" onClick={this.onClick}>{this.state.value}</div>
                {input}
            </h3>
        )
    }

    renderTextArea() {
        let className
        if (this.props.className) {
            className = this.props.className
        }

        if (!this.props.canEdit) {
            return (
                <div className={className}>
                    <ul>
                        <li><strong>{this.props.name}</strong></li>
                        <li><div>{this.props.value}</div></li>
                    </ul>
                </div>
            )
        }

        let fillNow
        if (!this.state.value && !this.state.isEditing) {
            fillNow = (
                <div className="card-profile__fill">Meteen invullen</div>
            )
        }

        className += " " + classnames({"___is-editable-field": true, "___is-editing": this.state.isEditing})

        return (
            <div className={className}>
                <ul>
                    <li><strong>{this.props.name}</strong></li>
                    <li>
                        <span className={classnames({"___is-editable-field": true, "___is-editing": this.state.isEditing, "___is-empty": !this.state.value})} onClick={this.onClick} style={{width:"100%"}}>
                            <span className="editable-field">{this.state.value || "..."}</span>
                            {fillNow}
                            <div className="editor profile__editor">
                                <textarea ref="input" onChange={this.onChange} onBlur={this.onBlur} value={this.state.value || ""} className="profile__textarea" />
                            </div>
                        </span>
                    </li>
                </ul>
            </div>
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