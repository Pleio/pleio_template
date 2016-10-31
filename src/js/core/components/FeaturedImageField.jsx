import React from "react"
import classnames from "classnames"

class FeaturedImageField extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            image: null,
            imagePreviewUrl: this.props.value || null
        }

        this.triggerFileSelect = this.triggerFileSelect.bind(this)
        this.changeImage = this.changeImage.bind(this)
        this.isValid = this.isValid.bind(this)
        this.getValue = this.getValue.bind(this)
        this.clearValue = this.clearValue.bind(this)
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

    triggerFileSelect(e) {
        this.refs.image.click()
    }

    changeImage(e) {
        let reader = new FileReader();
        let file = e.target.files[0]

        reader.onloadend = () => {
            this.setState({
                image: file,
                imagePreviewUrl: reader.result
            })
        }

        reader.readAsDataURL(file)
    }

    isValid() {
        return true;
    }

    getValue() {
        return this.state.image
    }

    clearValue() {
        this.setState({
            image: false,
            imagePreviewUrl: null
        })
    }

    render() {
        let content
        if (this.state.imagePreviewUrl) {
            content = (
                <div className="lead" style={{backgroundImage: "url(" + this.state.imagePreviewUrl + ")", width:"100%", height:"100%"}} />
            )
        } else {
            content = (
                <div className="upload-image__placeholder">
                    <div className="upload-image__title">Upload een afbeelding</div>
                    <div className="upload-image__dimensions">(1.400 x 396 pixels)</div>
                </div>
            )
        }

        return (
            <div className={classnames({"upload-image": true, "___is-uploaded": this.state.imagePreviewUrl ? true : false})}>
                <input type="file" ref="image" name="image" onChange={this.changeImage} className="___is-hidden" accept="image/*" />
                {content}
                <div className="upload-image__actions">
                    <div className="button ___primary upload-image__edit" onClick={this.triggerFileSelect}>
                        <span>Afbeelding wijzigen</span>
                    </div>
                    <div className="button ___primary upload-image__delete" onClick={this.clearValue}>
                        <span>Afbeelding verwijderen</span>
                    </div>
                </div>
            </div>
        )
    }
}

FeaturedImageField.contextTypes = {
    attachToForm: React.PropTypes.func,
    detachFromForm: React.PropTypes.func
}

export default FeaturedImageField