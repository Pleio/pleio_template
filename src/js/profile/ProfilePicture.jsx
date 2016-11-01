import React from "react"
import Modal from "../core/components/Modal"
import Form from "../core/components/Form"
import { graphql } from "react-apollo"
import { connect } from "react-redux"
import gql from "graphql-tag"
import Cropper from "react-cropper"

class ProfilePicture extends React.Component {
    constructor(props) {
        super(props)

        this.startFilePicker = this.startFilePicker.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onClear = this.onClear.bind(this)
        this.onCrop = this.onCrop.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            profilePicture: null,
            croppedProfilePicture: null
        }
    }

    startFilePicker() {
        this.refs.profilePicture.click()
    }

    onChange(e) {
        let reader = new FileReader()
        reader.onload = () => {
            this.setState({
                profilePicture: reader.result
            })
        }

        let file = e.target.files[0]
        reader.readAsDataURL(file)
    }

    onClear(e) {
        e.preventDefault()

        this.setState({
            profilePicture: null,
            croppedProfilePicture: null
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
                croppedProfilePicture: this.cropper.getCroppedCanvas().toDataURL()
            })
        }, 100)
    }

    onSubmit(e) {
        e.preventDefault()

        this.cropper.getCroppedCanvas().toBlob((blob) => {
            let file = new File([blob], "avatar.png");

            this.props.mutate({
                variables: {
                    input: {
                        clientMutationId: 1,
                        guid: this.props.entity.guid,
                        avatar: file
                    }
                }
            }).then(({data}) => {
                //this.props.dispatch(hideModal())
            }).catch((errors) => {
                this.setState({
                    errors: errors
                })
            })

        })
    }

    render() {
        let cropper, largeCroppedImage, smallCroppedImage

        if (this.state.profilePicture) {
            cropper = (
                <Cropper ref={cropper => {this.cropper = cropper}} src={this.state.profilePicture} aspectRatio={1/1} guides={true} style={{width:"377px", height:"342px"}} crop={this.onCrop} />
            )
        } else {
            cropper = (
                <div className="edit-picture__upload">
                    + Foto uploaden
                    <input ref="profilePicture" name="profilePicture" type="file" onChange={this.onChange} />
                </div>
            )
        }

        if (this.state.croppedProfilePicture) {
            largeCroppedImage = (
                <img src={this.state.croppedProfilePicture} width="168" height="168" />
            )
            smallCroppedImage = (
                <img src={this.state.croppedProfilePicture} width="48" height="48" />
            )
        }

        return (
            <Modal ref="modal" id="profile-picture" title="Bewerk profielfoto">
                <Form onSubmit={this.onSubmit}>
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
                                <div className="edit-picture__previews">
                                    <div className="edit-picture__preview">
                                        {largeCroppedImage}
                                    </div>
                                    <div className="edit-picture__preview ___small">
                                        {smallCroppedImage}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="buttons ___end ___gutter ___margin-top">
                        <button className="button ___grey" onClick={this.onClear}>
                            Foto verwijderen
                        </button>
                        <button className="button ___primary" type="submit">
                            Opslaan
                        </button>
                    </div>
                </Form>
            </Modal>
        )
    }
}

const Query = gql`
    mutation editAvatar($input: editAvatarInput!) {
        editAvatar(input: $input) {
            user {
                guid
                icon
            }
        }
    }
`
const withQuery = graphql(Query)
export default connect()(withQuery(ProfilePicture))