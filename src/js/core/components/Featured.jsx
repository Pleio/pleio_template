import React from "react"
import { Link } from "react-router-dom"
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
        const { entity, inCard, inActivityFeed, showEmpty, group } = this.props
        const { featured } = entity

        let background
        if (featured.image) {
            background = { backgroundImage: `url(${featured.image}`, "backgroundPositionY": featured.positionY + "%"}
        } else if (featured.video) {
            background = { backgroundImage: `url(${getVideoThumbnail(featured.video)}`, "backgroundPositionY": featured.positionY + "%"}
        } else if (showEmpty) {
            if (group) {
                background = { backgroundColor: "#fafafa" }
            } else {
                background = { backgroundColor: "#8fcae7" }
            }
        }

        let playButton
        if (featured.video) {
            playButton = (
                <div className={classnames({"play-button":true, "___small":inCard})} onClick={this.playVideo} />
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
                if (background) {
                    return (
                        <Link to={this.props.to}>
                            <div style={background} className="card-blog-post__image">
                                {playButton}
                                {videoModal}
                            </div>
                        </Link>
                    )
                } else {
                    return ( <div /> )
                }
            default:
                // not an in-card view
                if (background) {
                    return (
                        <div style={background} className={classnames({"lead ___content": true, "___video": featured.video, "___event": this.props.event, "___group": this.props.group, "___has-background": featured.image || featured.video,"___bottom": this.props.bottom})}>
                            <div className="container lead__justify">
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