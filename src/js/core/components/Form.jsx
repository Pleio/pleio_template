import React from "react"
import classnames from "classnames"
import { EditorState } from "draft-js"
import InputField from "./InputField"
import RichTextField from "./RichTextField"
import SelectField from "./SelectField"
import CheckField from "./CheckField"
import SwitchField from "./SwitchField"
import FeaturedImageField from "./FeaturedImageField"

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
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            validationStarted: true
        })

        if (this.isValid()) {
            if (this.props.onSubmit) {
                this.props.onSubmit(e);
            }

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
                case SelectField:
                case RichTextField:
                case SwitchField:
                case CheckField:
                    return this.wrapComponent(child)
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
        let hasError, errorMessage, value
        hasError = this.state.validationStarted && !this.inputs[component.props.name].isValid()

        if (hasError) {
            errorMessage = (
                <div className="form__error">
                    Vul een correcte waarde in.
                </div>
            )
        }

        const clonedComponent = React.cloneElement(component, {
            onChange: this.onChange
        })

        return (
            <label className={classnames({form__item: true, "__error": hasError})}>
                {clonedComponent}
                {errorMessage}
            </label>
        )
    }
}

Form.childContextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default Form