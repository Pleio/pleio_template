import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import PropTypes from "prop-types"

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
        let text = "+ Bestand uploaden"
        if (this.props.multiple) {
            text = "+ Bestand(en) uploaden"
        }

        let amount
        if (this.state.value) {
            amount = `(${this.state.value.length})`
        }

        if (this.props.isUploading) {
            return (
                <div className="editor__upload">
                    <div className="infinite-scroll__spinner">
                        <img src="/mod/pleio_template/src/images/spinner.svg" />
                    </div>
                </div>
            )
        }


        return (
            <div className="editor__upload">
                <input
                    ref="field"
                    name={this.props.name}
                    type="file"
                    className="___is-hidden"
                    onChange={this.onChange}
                    multiple={this.props.multiple}
                />
                <span>{text} {amount}</span>
            </div>
        )
    }
}

FileField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default FileField