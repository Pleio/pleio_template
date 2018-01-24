import React from "react"
import { graphql } from "react-apollo"
import gql from "graphql-tag"
import classnames from "classnames"
import RichTextField from "../../core/components/RichTextField"
import RichTextView from "../../core/components/RichTextView"
import SwitchField from "../../core/components/SwitchField"
import { convertToRaw } from "draft-js"
import autobind from "autobind-decorator"

class ProfileField extends React.Component {
    constructor(props) {
        super(props)

        const { field } = this.props

        this.state = {
            isEditing: false,
            accessId: field ? field.accessId : 0,
            value: field ? field.value : ""
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps === this.props) {
            return
        }

        const { field } = nextProps

        this.setState({
            accessId: field.accessId || 0,
            value: field.value || ""
        })
    }

    @autobind
    onChange(value) {
        this.setState({ value: value })
    }

    @autobind
    onClick(e) {
        if (!this.props.canEdit) {
            return
        }

        this.setState({
            isEditing: true
        })

        setTimeout(() => {
            if (this.refs.input) {
                this.refs.input.focus()
            }
        }, 0)
    }

    @autobind
    onKeyPress(e) {
        const keyCode = e.keyCode ? e.keyCode : e.which
        if (keyCode !== 13) { // Enter button
            return;
        }

        this.submitField()
    }

    @autobind
    onBlur(e) {
        let value
        if (this.props.type == "richTextarea") {
            value = JSON.stringify(convertToRaw(this.refs.input.getValue()))
        } else {
            value = this.state.value
        }

        this.submitField(value)
    }

    @autobind
    submitField(value) {
        // do not save an empty h3 field
        if (this.props.type == "h3" && !value) {
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
                    accessId: 2,
                    value
                }
            }
        }).then((data) => {
            this.isMutating = false
        })
    }

    render() {
        switch (this.props.type) {
            case "richTextarea":
                return this.renderRichTextArea()
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
                    <label>{this.props.field.name}</label>
                    <span>{this.state.value}</span>
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
                <label>{this.props.field.name}</label>
                <span className={classnames({"___is-editable-field": true, "___is-editing": this.state.isEditing, "___is-empty": !this.state.value, "___is-private": (this.state.accessId === 0)})} onClick={this.onClick}>
                    <span className="editable-field">{this.state.value || "..."}</span>
                    {fillNow}
                    <input type="text" ref="input" onChange={(e) => this.onChange(e.target.value)} onKeyPress={this.onKeyPress} onBlur={this.onBlur} value={this.state.value || ""} />
                </span>
            </li>
        )
    }

    renderH3() {
        let input
        if (this.props.canEdit) {
            input = (
                <input type="text" ref="input" onChange={(e) => this.onChange(e.target.value)} onKeyPress={this.onKeyPress} onBlur={this.onBlur} value={this.state.value} />
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
                        <li><strong>{this.props.field.name}</strong></li>
                        <li><div>{this.state.value}</div></li>
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

        className += " " + classnames({"___is-editable-field": true, "___is-editing": this.state.isEditing, "___is-private": (this.state.accessId === 0)})

        return (
            <div className={className}>
                <ul>
                    <li><strong>{this.props.field.name}</strong></li>
                    <li>
                        <span className={classnames({"___is-editable-field": true, "___is-editing": this.state.isEditing, "___is-empty": !this.state.value})} onClick={this.onClick} style={{width:"100%"}}>
                            <span className="editable-field">{this.state.value || "..."}</span>
                            {fillNow}
                            <div className="editor profile__editor">
                                <textarea ref="input" onChange={(e) => this.onChange(e.target.value)} onBlur={this.onBlur} value={this.state.value || ""} className="profile__textarea" />
                            </div>
                        </span>
                    </li>
                </ul>
            </div>
        )
    }

    renderRichTextArea() {
        let className
        if (this.props.className) {
            className = this.props.className
        }

        if (!this.props.canEdit) {
            return (
                <div className={className}>
                    <ul>
                        <li><strong>{this.props.field.name}</strong></li>
                        <li><div>{this.state.value}</div></li>
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

        className += " " + classnames({ "___is-editable-field": true, "___is-editing": this.state.isEditing })

        let field

        let value
        if (this.state.value) {
            try {
                JSON.parse(this.state.value)

                value = (
                    <RichTextView richValue={this.state.value} />
                )

                if (this.state.isEditing) {
                    field = (
                        <div>
                            <RichTextField ref="input" richValue={this.state.value} className="profile__textarea" minimal />
                            <div className="buttons">
                                <button className="button" onClick={this.onBlur}>Opslaan</button>
                            </div>
                        </div>
                    )
                }
            } catch (e) {
                value = this.state.value

                if (this.state.isEditing) {
                    field = (
                        <div>
                            <RichTextField ref="input" value={this.state.value} className="profile__textarea" minimal />
                            <div className="buttons">
                                <button className="button" onClick={this.onBlur}>Opslaan</button>
                            </div>
                        </div>
                    )
                }
            }
        } else {
            value = "..."

            if (this.state.isEditing) {
                field = (
                    <div>
                        <RichTextField ref="input" richValue={this.state.value} className="profile__textarea" minimal />
                        <div className="buttons">
                            <button className="button" onClick={this.onBlur}>Opslaan</button>
                        </div>
                    </div>
                )
            }
        }

        return (
            <div className={className}>
                <ul>
                    <li><strong>{this.props.field.name}</strong></li>
                    <li>
                        <span className={classnames({ "___is-editable-field": true, "___is-editing": this.state.isEditing, "___is-empty": !this.state.value })} onClick={this.onClick} style={{ width: "100%" }}>
                            <span className="editable-field">{value}</span>
                            {fillNow}
                        </span>
                    </li>
                </ul>
                {field}
            </div>
        )
    }
}

const Mutation = gql`
    mutation editProfileField($input: editProfileFieldInput!) {
        editProfileField(input: $input) {
            user {
                guid
                name
                profile {
                    key
                    name
                    value
                    accessId
                }
            }
        }
    }
`

export default graphql(Mutation)(ProfileField)