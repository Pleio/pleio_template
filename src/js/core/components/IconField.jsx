import React from "react"
import Cropper from "react-cropper"

export default class IconField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            icon: null,
            croppedIcon: null
        }

        this.startFilePicker = this.startFilePicker.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onClear = this.onClear.bind(this)
        this.onCrop = this.onCrop.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    startFilePicker() {
        this.refs.iconFile.click()
    }

    onChange(e) {
        let reader = new FileReader()
        reader.onload = () => {
            this.setState({
                icon: reader.result
            })
        }

        let file = e.target.files[0]
        reader.readAsDataURL(file)
    }

    onClear(e) {
        e.preventDefault()

        this.setState({
            icon: null,
            croppedIcon: null
        })
    }

    onCrop(e) {
        e.preventDefault()

        if (!this.cropper.getCroppedCanvas()) {
            return
        }

        clearTimeout(this.scheduleCrop)
        this.scheduleCrop = setTimeout(() => {
            this.setState({
                croppedIcon: this.cropper.getCroppedCanvas().toDataURL("image/jpeg", 0.6)
            })
        }, 100)
    }

    getValue() {
        const callback = (blob) => {
            let file
            if (blob) {
                file = blob;
            } else {
                file = null;
            }

            return file
        }

        if (this.cropper) {
            const croppedCanvas = this.cropper.getCroppedCanvas()
            if (typeof croppedCanvas.msToBlob === "function") {
                let blob = croppedCanvas.msToBlob()
                callback(blob)
            } else {
                croppedCanvas.toBlob(callback)
            }
        } else {
            // no picture selected
            callback(null)
        }
    }

    render() {
        let cropper, largeCroppedImage, smallCroppedImage

        if (this.state.icon) {
            cropper = (
                <Cropper ref={cropper => {this.cropper = cropper}} src={this.state.icon} aspectRatio={1/1} guides={true} style={{width:"377px", height:"377px"}} crop={this.onCrop} />
            )
        } else {
            cropper = (
                <div className="edit-picture__upload" onClick={this.startFilePicker}>
                    + Foto uploaden
                    <input ref="iconFile" name="iconFile" type="file" onChange={this.onChange} className="___is-hidden" />
                </div>
            )
        }

        if (this.state.icon) {
            largeCroppedImage = (
                <img src={this.state.croppedIcon} style={{maxWidth:"100%", maxHeight:"100%", width:"168px", height:"168px"}} />
            )
            smallCroppedImage = (
                <img src={this.state.croppedIcon} style={{maxWidth:"100%", maxHeight:"100%", width:"48px", height:"48px"}}/>
            )
        }

        return (
            <div className="row">
                <div className="col-sm-6">
                    <label className="form__item">
                        <div className="form__label">Foto bijsnijden</div>
                    </label>
                    {cropper}
                </div>
                <div className="col-sm-5 col-sm-offset-1">
                    <label className="form__item">
                        <div className="form__label">
                            Voorbeelden
                        </div>
                    </label>
                    <div className="edit-picture__previews">
                        <div className="edit-picture__preview" style={{background: "url(/mod/pleio_template/src/images/user.png) center center / cover no-repeat"}}>
                            {largeCroppedImage}
                        </div>
                        <div className="edit-picture__preview ___small" style={{background: "url(/mod/pleio_template/src/images/user.png) center center / cover no-repeat"}}>
                            {smallCroppedImage}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}