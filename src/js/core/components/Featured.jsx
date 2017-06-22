import React from "react"
import { getVideoFromUrl, getVideoThumbnail } from "../../lib/helpers"
import { getClassFromTags } from "../../lib/helpers"
import VideoModal from "./VideoModal"
import classnames from "classnames"

export default class Featured extends React.Component {
    constructor(props) {
        super(props)
        this.playVideo = this.playVideo.bind(this)
    }

    playVideo(e) {
        if (this.refs.video) {
            this.refs.video.onToggle()
        }
    }

    render() {
        const { entity, inCard, inActivityFeed } = this.props
        const { featured } = entity

        let backgroundImage = ""
        if (featured.image) {
            backgroundImage = featured.image
        } else if (featured.video) {
            backgroundImage = getVideoThumbnail(featured.video)
        }

        let playButton
        if (featured.video) {
            playButton = (
                <div className={classnames({"play-button":true, "___small":inCard})} />
            )
        }

        let videoModal
        if (featured.video) {
            const video = getVideoFromUrl(featured.video)
            videoModal = (
                <VideoModal ref="video" id={video.id} type={video.type} url={featured.video} />
            )
        }

        switch (inCard) {
            case "blog":
                if (backgroundImage) {
                    return (
                        <div style={{"backgroundImage": `url(${backgroundImage})`, "backgroundPositionY": featured.positionY + "%"}} className="card-blog-post__image" onClick={this.playVideo}>
                            {playButton}
                            {videoModal}
                        </div>
                    )
                } else {
                    return ( <div /> )
                }
            default:
                // not an in-card view
                if (backgroundImage) {
                    return (
                        <div className={classnames({"lead ___content": true, "___video": featured.video, "___event": this.props.event, "___bottom": this.props.bottom})}>
                            <div className="lead__background" style={{"backgroundImage": `url(${backgroundImage})`, "backgroundPositionY": featured.positionY + "%"}} onClick={this.playVideo} />
                            <div className="lead__justify">
                                {playButton}
                                {this.props.children}
                            </div>
                            {videoModal}
                        </div>
                    )
                } else {
                    return ( <div /> )
                }
        }
    }
}