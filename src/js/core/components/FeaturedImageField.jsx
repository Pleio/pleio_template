import React from "react"
import classnames from "classnames"
import PropTypes from "prop-types"
import Modal from "./NewModal"
import Form from "./Form"
import { getVideoThumbnail } from "../../lib/helpers"

class FeaturedImageField extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            type: null,
            content: null,
            previewUrl: this.props.value || null
        }

        this.selectImage = this.selectImage.bind(this)
        this.selectVideo = this.selectVideo.bind(this)
        this.changeImage = this.changeImage.bind(this)
        this.changeVideo = this.changeVideo.bind(this)
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

    selectImage(e) {
        e.preventDefault()
        this.refs.image.click()
    }

    selectVideo(e) {
        e.preventDefault()
        this.refs.videoModal.toggle()
    }

    changeImage(e) {
        let reader = new FileReader();
        let file = e.target.files[0]

        if (!file) {
            return
        }

        reader.onloadend = () => {
            this.setState({
                type: "IMAGE",
                content: file,
                previewUrl: reader.result
            })
        }

        reader.readAsDataURL(file)
    }

    changeVideo(e) {
        e.preventDefault()

        const url = this.refs.videoLink.value
        this.setState({
            type: "VIDEO",
            content: url,
            previewUrl: getVideoThumbnail(url)
        })

        this.refs.videoModal.toggle()
    }

    isValid() {
        return true;
    }

    getValue() {
        return this.state.content
    }

    clearValue() {
        this.setState({
            type: null,
            content: null,
            previewUrl: null
        })
    }

    render() {
        let content
        if (this.state.previewUrl) {
            content = (
                <div className="lead" style={{backgroundImage: "url(" + this.state.previewUrl + ")", width:"100%", height:"100%"}} />
            )
        }

        return (
            <div className={classnames({"upload-image": true, "___uploaded-video": this.state.type === "VIDEO", "___uploaded-image": this.state.type === "IMAGE"})} style={{"backgroundImage": this.state.previewUrl ? `url(${this.state.previewUrl})` : null}}>
                <div className="container relative">
                    <div className="upload-image__boxes">
                        <div className="upload-image__box ___image" onClick={this.selectImage}>
                            <div className="upload-image__placeholder">
                                <div className="upload-image__title">Upload een afbeelding</div>
                                <div className="upload-image__subtitle">(1.400 x 396 pixels)</div>
                            </div>
                        </div>
                        <div className="upload-image__box ___video" onClick={this.selectVideo}>
                            <div className="upload-image__placeholder">
                                <div className="upload-image__title">Upload een video</div>
                                <div className="upload-image__subtitle">(link invoeren)</div>
                            </div>
                        </div>
                    </div>
                    <div className="upload-image__actions ___image">
                        <div className="button ___primary upload-image__edit" onClick={this.selectImage}>
                            <span>Afbeelding wijzigen</span>
                        </div>
                        <div className="button ___primary upload-image__delete" onClick={this.clearValue}>
                            <span>Afbeelding verwijderen</span>
                        </div>
                    </div>
                    <div className="upload-image__actions ___video">
                        <div className="button ___primary upload-image__edit" onClick={this.selectVideo}>
                            <span>Video wijzigen</span>
                        </div>
                        <div className="button ___primary upload-image__delete" onClick={this.clearValue}>
                            <span>Video verwijderen</span>
                        </div>
                    </div>
                </div>
                <input type="file" ref="image" name="image" onChange={this.changeImage} accept="image/*" className="___is-hidden" />
                <Modal ref="videoModal" small title="Upload een video">
                    <p>Plaats hieronder de url van de video die je wilt toevoegen. Bijvoorbeeld van YouTube of Vimeo.</p>
                    <div className="form">
                        <label className="form__item">
                            <input ref="videoLink" type="text" name="link" placeholder="Link" />
                        </label>
                        <div className="buttons ___end">
                            <button className="button" onClick={this.changeVideo}>Invoegen</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

FeaturedImageField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default FeaturedImageField