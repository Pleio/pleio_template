import React from "react"
import { Link } from "react-router-dom"
import { getVideoFromUrl, getVideoThumbnail } from "../../lib/helpers"
import { getClassFromTags } from "../../lib/helpers"
import VideoModal from "../../core/components/VideoModal"
import classnames from "classnames"

export default class Card extends React.Component {
    constructor(props) {
        super(props)
        this.playVideo = this.playVideo.bind(this)
    }

    playVideo(e) {
        e.preventDefault()
        if (this.refs.video) {
            this.refs.video.onToggle()
        }
    }

    render() {
        const { entity, inActivityFeed } = this.props
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
                <div className="play-button ___small" onClick={this.playVideo} />
            )
        }

        let videoModal
        if (featured.video) {
            const video = getVideoFromUrl(featured.video)
            videoModal = (
                <VideoModal ref="video" id={video.id} type={video.type} />
            )
        }

        let content
        if (inActivityFeed) {
            content = (
                <div className="card-tile__content">
                    <h3 className="card-tile__title ___large">{entity.title}</h3>
                    <div className="read-more"><div className="read-more__circle" /><span>Lees meer</span></div>
                </div>
            )
        } else {
            if (entity.isHighlighted) {
                content = (
                    <div className="card-tile__content">
                        <h3 className="card-tile__title ___large">{entity.title}</h3>
                        <div className="read-more"><div className="read-more__circle" /><span>Lees meer</span></div>
                    </div>
                )
            } else {
                content = (
                    <div className="card-tile__content">
                        <div className="card-tile__content-justify">
                            <h3 className="card-tile__title">{entity.title}</h3>
                            <p>{entity.excerpt}</p>
                        </div>
                        <div className="read-more"><div className="read-more__circle" /><span>Lees meer</span></div>
                    </div>
                )
            }
        }

        let activityContainer
        if (backgroundImage) {
            activityContainer = (
                <div style={{"backgroundImage": `url(${backgroundImage})`, "backgroundPositionY": featured.positionY + "%"}} className="card-tile__image">
                    {content}
                    {playButton}
                </div>
            )
        } else {
            activityContainer = content
        }

        let cardContainer
        if (entity.isHighlighted) {
            if (backgroundImage) {
                cardContainer = (
                    <Link to={entity.url} className={classnames({"card-tile ___small-card": true, "___full-image":entity.isHighlighted, "___no-image": !backgroundImage, [getClassFromTags(entity.tags)]: true})}>
                        <div style={{"backgroundImage": `url(${backgroundImage})`, "backgroundPositionY": featured.positionY + "%"}} className="card-tile__image">
                            {content}
                        </div>
                    </Link>
                )
            } else {
                cardContainer = (
                    <Link to={entity.url} className={classnames({"card-tile ___small-card": true, "___full-image":entity.isHighlighted, "___no-image": !backgroundImage, [getClassFromTags(entity.tags)]: true})}>
                        {content}
                    </Link>
                )
            }
        } else {
            let image
            if (backgroundImage) {
                image = ( <div style={{"backgroundImage": `url(${backgroundImage})`, "backgroundPositionY": featured.positionY + "%"}} className="card-tile__image" /> )
            } else {
                image = ( <div className="card-tile__placeholder" /> )
            }

            cardContainer = (
                <Link to={entity.url} className={classnames({"card-tile ___small-card": true, "___full-image":entity.isHighlighted, "___no-image": !backgroundImage, [getClassFromTags(entity.tags)]: true})}>
                    {image}
                    {content}
                </Link>
            )
        }


        if (inActivityFeed) {
            return (
                <div className="card-tile-container">
                    <Link to={entity.url} className={classnames({"card-tile ___small-card":true, "___full-video":featured.video, "___full-image":!featured.video, "___no-image": !backgroundImage, "___is-highlighted": (entity.isHighlighted && backgroundImage), [getClassFromTags(entity.tags)]: true})}>
                        {activityContainer}
                        {videoModal}
                    </Link>
                </div>
            )
        } else {
            return (
                <div className={entity.isHighlighted ? "col-sm-12 col-lg-8" : "col-sm-6 col-lg-4"}>
                    <div className="card-tile-container">
                        {cardContainer}
                    </div>
                </div>
            )
        }
    }
}