import React from "react"
import Joi from "joi-browser"
import classnames from "classnames"
import { EditorState } from "draft-js"
import InputField from "./InputField"
import RichTextField from "./RichTextField"

class Form extends React.Component {
    constructor(props) {
        super(props)

        this.inputs = {}
        this.onSubmit = this.onSubmit.bind(this)
        this.attachToForm = this.attachToForm.bind(this)
        this.detachFromForm = this.detachFromForm.bind(this)
        this.wrapComponent = this.wrapComponent.bind(this)
        this.getValues = this.getValues.bind(this)
        this.refCounter = 0

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

    onSubmit(e) {
        e.preventDefault()

        this.setState({
            validationStarted: true
        })

        let allValid = true;
        Object.keys(this.inputs).forEach((name) => {
            let { error, value } = this.inputs[name].isValid()
            if (error !== null) {
                allValid = false;
            }
        })

        if (allValid) {
            this.props.onSubmit(e)
        }
    }

    getValues() {
        let values = []
        Object.keys(this.inputs).forEach((name) => {
            values[name] = this.inputs[name].getValue()
        })

        return values
    }

    render() {
        let i = 0
        let children = React.Children.map(this.props.children, (child) => {
            switch (child.type) {
                case InputField:
                case RichTextField:
                    return this.wrapComponent(child)
                default:
                    return child
            }
        })

        return (
            <form className={"form " + this.props.className} onSubmit={this.onSubmit}>
                {children}
            </form>
        )
    }

    wrapComponent(component) {
        let error
        if (this.state.validationStarted && !this.inputs[component.props.name].isValid()) {
            error = (
                <span className="form__item-error-message">
                    Vul een correcte waarde in.
                </span>
            )
        }

        return (
            <label className={classnames({form__item: true, "form__item-error": this.state.validationStarted && !this.inputs[component.props.name].isValid()})}>
                {component}
                {error}
            </label>
        )
    }
}

Form.childContextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default Form