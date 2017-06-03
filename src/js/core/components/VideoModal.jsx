import React from "react"
import classnames from "classnames"

export default class VideoModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isVisible: false
        }

        this.onToggle = (e) => {
            if (e) { e.preventDefault() }
            this.setState({isVisible: !this.state.isVisible})
        }
    }

    render() {
        let url, video
        switch (this.props.type) {
            case "vimeo":
                url = `//player.vimeo.com/video/${this.props.id}?title=0&byline=0&portrait=0&autoplay=1`
                break
            case "youtube":
                url = `//www.youtube.com/embed/${this.props.id}?autoplay=1&modestbranding=1&rel=0&showinfo=0"`
                break
        }

        if (this.state.isVisible) {
            video = (
                <iframe src={url} frameBorder="0" allowFullScreen="" />
            )
        }

        return (
            <div className={classnames({"modal ___video": true, "___is-open": this.state.isVisible})}>
                <div className="modal__wrapper">
                    <div className="modal__background" onClick={this.onToggle} />
                    <div className="container">
                        <div className="video">
                            <span className="video__close" onClick={this.onToggle}></span>
                            {video}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}