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
        window.addEventListener("scroll", this.onScroll)
        window.addEventListener("touchmove", this.onScroll)
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll)
        window.removeEventListener("touchmove", this.onScroll)
    }

    onScroll(e) {
        const headerHeight = 60
        const offsetTop = this.refs.likeAndBookmark.getBoundingClientRect().top
        const scrolled = document.body.scrollTop

        if (window.innerWidth < 1023) {
            return
        }

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