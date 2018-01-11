import React from "react"
import { Link } from "react-router-dom"
import autobind from "autobind-decorator"
import { getVideoFromUrl, getVideoThumbnail } from "../../lib/helpers"
import { getClassFromTags } from "../../lib/helpers"
import { showFullDate } from "../../lib/showDate"
import classnames from "classnames"
import AttendButtons from "./AttendButtons"
import VideoModal from "../../core/components/VideoModal"
import Select from "../../core/components/NewSelect"
import People from "../../core/components/People"

export default class Card extends React.Component {
    @autobind
    playVideo(e) {
        e.preventDefault()

        if (this.refs.video) {
            this.refs.video.onToggle()
        }
    }

    render() {
        const { entity } = this.props

        let style
        if (entity.featured.image) {
            style = { backgroundImage: `url(${entity.featured.image}`}
        } else if (entity.featured.video) {
            style = { backgroundImage: `url(${getVideoThumbnail(entity.featured.video)}`}
        } else {
            style = { backgroundColor: "#8fcae7" }
        }

        let playButton
        if (entity.featured.video) {
            playButton = (
                <div className="play-button ___small" onClick={this.playVideo} />
            )
        }

        let videoModal
        if (entity.featured.video) {
            const video = getVideoFromUrl(entity.featured.video)
            videoModal = (
                <VideoModal ref="video" id={video.id} type={video.type} url={entity.featured.video} />
            )
        }

        let picture
        picture = (
            <Link to={entity.url} className="card-event__picture" title={entity.title} style={style}>
                {playButton}
            </Link>
        )

        let attendButtons
        if (entity.rsvp && entity.inGroup) {
            attendButtons = (
                <AttendButtons entity={entity} />
            )
        }

        let attendees
        if (entity.rsvp) {
            attendees = (
                <Link to={entity.url}>
                    <People users={entity.attendees} />
                </Link>
            )
        }

        return (
            <div className="card-event">
                {picture}
                <div className="card-event__content">
                    <div className="date">{showFullDate(entity.startDate)}</div>
                    <Link to={entity.url} className="title ___colored">{entity.title}</Link>
                    <div className="card-event__bottom">
                        {attendees}
                    </div>
                </div>
                {videoModal}
            </div>
        )
    }
}