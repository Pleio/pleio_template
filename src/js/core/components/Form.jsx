import React from "react"
import classnames from "classnames"
import { EditorState } from "draft-js"
import InputField from "./InputField"
import IconField from "./IconField"
import TagsField from "./TagsField"
import TextField from "./TextField"
import FileField from "./FileField"
import DateTimeField from "./DateTimeField"
import RichTextField from "./RichTextField"
import SelectField from "./SelectField"
import CheckField from "./CheckField"
import SwitchField from "./SwitchField"
import PropTypes from "prop-types"

class Form extends React.Component {
    constructor(props) {
        super(props)

        this.wrapComponent = this.wrapComponent.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.clearValues = this.clearValues.bind(this)

        this.attachToForm = this.attachToForm.bind(this)
        this.detachFromForm = this.detachFromForm.bind(this)
        this.onChange = this.onChange.bind(this)

        this.inputs = {}

        this.state = {
            validationStarted: false
        }
    }

    getChildContext() {
        return {
            attachToForm: this.attachToForm,
            detachFromForm: this.detachFromForm
        }
    }

    attachToForm(component) {
        this.inputs[component.props.name] = component
    }

    detachFromForm(component) {
        delete this.inputs[component.props.name]
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.values !== nextProps.values) {
            this.setState({
                values: nextProps.values
            })
        }
    }

    onChange(e) {
        // child has updated it's state, so re-render the form component
        this.forceUpdate()

        if (this.props.onChange) {
            this.props.onChange(e)
        }
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            validationStarted: true
        })

        if (this.isValid()) {
            // trigger onChange event on every input to work around browser bugs
            // dispatching different events for auto-fill and so on...
            Object.keys(this.inputs).forEach((name) => {
                if (this.inputs[name].forceUpdate) {
                    this.inputs[name].forceUpdate()
                }
            })

            setTimeout(() => {
                if (this.props.onSubmit) {
                    this.props.onSubmit(e);
                }
            }, 10)

            this.setState({
                validationStarted: false
            })
        }
    }

    isValid() {
        let valid = true

        Object.keys(this.inputs).forEach((name) => {
            if (!this.inputs[name].isValid()) {
                valid = false
            }
        })

        return valid
    }

    getValues() {
        let values = {}
        Object.keys(this.inputs).forEach((name) => {
            values[name] = this.inputs[name].getValue()
        })

        return values
    }

    clearValues() {
        Object.keys(this.inputs).forEach((name) => {
            this.inputs[name].clearValue()
        })
    }

    render() {
        return (
            <form className={this.props.className} onSubmit={this.onSubmit}>
                {this.wrapChildren(this.props.children)}
            </form>
        )
    }

    wrapChildren(children) {
        return React.Children.map(children, (child) => {
            if (!child) {
                return child
            }

            switch (child.type) {
                case InputField:
                case FileField:
                case SelectField:
                case TextField:
                case RichTextField:
                case DateTimeField:
                case TagsField:
                case IconField:
                case SwitchField:
                case CheckField:
                    if (!child.props.noWrap) {
                        return this.wrapComponent(child)
                    }
                default:
                    if (child && child.props && child.props.children) {
                        return React.cloneElement(child, {
                            children: this.wrapChildren(child.props.children)
                        })
                    }

                    return child
            }
        })
    }

    wrapComponent(component) {
        let hasError, errorMessage, label, value
        hasError = this.state.validationStarted && !this.inputs[component.props.name].isValid()

        if (hasError) {
            errorMessage = (
                <div className="form__error">
                    Vul een correcte waarde in.
                </div>
            )
        }

        if ((component.type == RichTextField || component.type == InputField || component.type == SelectField || component.type == TextField || component.type == DateTimeField) && component.props.label) {
            label = (
                <div className="form__label">{component.props.label}</div>
            )
        }

        const clonedComponent = React.cloneElement(component, {
            onChange: this.onChange
        })

        return (
            <label className={classnames({form__item: true, "__error": hasError})}>
                {label}
                {clonedComponent}
                {errorMessage}
            </label>
        )
    }
}

Form.childContextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default Form