import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"

class FileField extends React.Component {
    constructor(props) {
        super(props)
        this.onChange = this.onChange.bind(this)
        this.state = {
            value: null
        }
    }

    componentWillMount() {
        if (this.context.attachToForm) {
            this.context.attachToForm(this)
        }
    }

    componentWillUnmount() {
        if (this.context.detachFromForm) {
            this.context.detachFromForm(this)
        }
    }

    onChange(e) {
        let value
        if (this.props.multiple) {
            value = e.target.files
        } else {
            value = e.target.files[0]
        }

        this.setState({
            value
        })

        if (this.props.onChange) {
            this.props.onChange(e)
        }
    }

    isValid() {
        return true
    }

    getValue() {
        return this.state.value
    }

    clearValue() {
        this.setState({
            value: null
        })
    }

    render() {
        return (
            <input
                ref="field"
                name={this.props.name}
                type="file"
                className={this.props.className}
                placeholder={this.props.placeholder}
                onChange={this.onChange}
                multiple={this.props.multiple}
            />
        )
    }
}

FileField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default FileField