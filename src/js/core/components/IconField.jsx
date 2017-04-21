import React from "react"
import PropTypes from "prop-types"

class IconField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            src: this.props.value,
            icon: null
        }

        this.onChange = this.onChange.bind(this)
        this.onClear = this.onClear.bind(this)
        this.getValue = this.getValue.bind(this)
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
        this.setState({
            icon: e.target.files[0]
        })

        var reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                src: reader.result
            })
        }

        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        } else {
            this.setState({
                src: ""
            })
        }
    }

    onClear(e) {
        e.preventDefault()

        this.setState({
            icon: null
        })
    }

    isValid() {
        return true;
    }

    getValue() {
        return this.state.icon
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <div className="edit-picture__upload" onClick={this.startFilePicker}>
                        + Foto uploaden
                        <input ref="iconFile" name="iconFile" type="file" onChange={this.onChange} className="___is-hidden" />
                    </div>
                </div>
                <div className="col-sm-5 col-sm-offset-1">
                    <label className="form__item">
                        <div className="form__label">
                            Voorbeelden
                        </div>
                    </label>
                    <div className="edit-picture__previews">
                        <div className="edit-picture__preview" style={{background: "url(/mod/pleio_template/src/images/user.png) center center / cover no-repeat"}}>
                            <img src={this.state.src} style={{maxWidth:"100%", maxHeight:"100%", width:"168px", height:"168px"}} />
                        </div>
                        <div className="edit-picture__preview ___small" style={{background: "url(/mod/pleio_template/src/images/user.png) center center / cover no-repeat"}}>
                            <img src={this.state.src} style={{maxWidth:"100%", maxHeight:"100%", width:"48px", height:"48px"}}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

IconField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default IconField