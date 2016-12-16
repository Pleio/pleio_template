import React from "react"
import Likes from "./Likes"
import Bookmark from "../../bookmarks/components/Bookmark"

export default class LikeAndShare extends React.Component {
    constructor(props) {
        super(props)

        this.onScroll = this.onScroll.bind(this)

        this.state = {
            paddingTop: 0
        }

    }
    componentDidMount() {
        document.addEventListener("scroll", this.onScroll)
        document.addEventListener("touchmove", this.onScroll)
    }

    componentWillUnmount() {
        document.removeEventListener("scroll", this.onScroll)
        document.removeEventListener("touchmove", this.onScroll)
    }

    onScroll(e) {
        const headerHeight = 60
        const scrolled = document.body.scrollTop

        if (window.innerWidth < 1023) {
            return
        }

        if (typeof this.refs.likeAndBookmark === "undefined") {
            return
        }

        const offsetTop = this.refs.likeAndBookmark.getBoundingClientRect().top

        if (scrolled < offsetTop - headerHeight) {
            return
        }

        this.setState({
            paddingTop: - offsetTop + headerHeight + 10
        })
    }

    render () {
        if (!this.props.viewer.loggedIn) {
            return (
                <div></div>
            )
        }

        return (
            <div ref="likeAndBookmark" className="article__like-and-bookmark" style={{paddingTop: this.state.paddingTop}}>
                <Likes entity={this.props.entity} />
                <Bookmark entity={this.props.entity} />
            </div>
        )
    }
}