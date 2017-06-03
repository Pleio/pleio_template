import React from "react"
import classnames from "classnames"
import PropTypes from "prop-types"
import Modal from "./NewModal"
import Form from "./Form"
import { getVideoFromUrl, getVideoThumbnail } from "../../lib/helpers"

class FeaturedField extends React.Component {

    constructor(props) {
        super(props)

        this.state = this.props.value || {
            video: null,
            image: null,
            imageFile: null,
            positionY: 50
        }

        this.dragging = false

        this.selectImage = this.selectImage.bind(this)
        this.selectVideo = this.selectVideo.bind(this)
        this.changeImage = this.changeImage.bind(this)
        this.changeVideo = this.changeVideo.bind(this)
        
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onDoubleClick = this.onDoubleClick.bind(this)

        this.isValid = this.isValid.bind(this)
        this.getValue = this.getValue.bind(this)
        this.clearValue = this.clearValue.bind(this)
    }

    componentWillMount() {
        window.addEventListener("mouseup", this.onMouseUp)
        window.addEventListener("mousemove", this.onMouseMove)

        if (this.context.attachToForm) {
            this.context.attachToForm(this)
        }
    }

    componentWillUnmount() {
        window.removeEventListener("mouseup", this.onMouseUp)
        window.removeEventListener("mousemove", this.onMouseMove)

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
                image: reader.result,
                imageFile: file
            })
        }

        reader.readAsDataURL(file)
    }

    changeVideo(e) {
        e.preventDefault()

        const url = this.refs.videoLink.value
        this.setState({
            video: url,
            image: null,
            imageFile: null
        })

        this.refs.videoModal.toggle()
    }

    onMouseDown(e) {
        this.dragging = true
        this.originY = e.clientY
        this.newY = this.state.positionY
    }

    onMouseMove(e) {
        if (!this.dragging) {
            return
        }

        this.newY = Math.min(Math.max(0, (this.newY - (e.clientY - this.originY) / 5)), 100)
        this.originY = e.clientY

        this.setState({
            positionY: this.newY
        })
    }

    onMouseUp(e) {
        this.dragging = false
    }


    onDoubleClick(e) {
        this.setState({
            positionY: 50
        })
    }

    isValid() {
        return true;
    }

    getValue() {
        if (!this.state.video && !this.state.image) {
            return null
        }

        let image = null
        if (this.state.imageFile) {
            image = this.state.imageFile
        } else if (!this.state.image && !this.state.imageFile) {
            image = "false"
        }

        return {
            video: this.state.video,
            image: image,
            positionY: this.state.positionY
        }
    }

    clearValue() {
        this.setState({
            video: null,
            image: null,
            imageFile: null
        })
    }

    render() {
        let backgroundImage = ""
        if (this.state.image) {
            backgroundImage = this.state.image
        } else if (this.state.video) {
            backgroundImage = getVideoThumbnail(this.state.video)
        }

        return (
            <div onMouseDown={this.onMouseDown} onDoubleClick={this.onDoubleClick} className={classnames({"upload-image": true, "___uploaded-video": this.state.video, "___uploaded-image": this.state.image && !this.state.video})} style={{"backgroundImage": `url(${backgroundImage})`, "backgroundPositionY": this.state.positionY + "%"}}>
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
                        <div className="button ___primary upload-image__delete" onClick={this.selectImage}>
                            <span>Preview wijzigen</span>
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

FeaturedField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default FeaturedField