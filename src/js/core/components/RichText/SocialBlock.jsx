import React from "react"
import { loadScript } from "../../../lib/helpers"
import fetchJsonp from "fetch-jsonp"

const networks = {
    twitter: /twitter.com\/.+?\/status\/([0-9].+)$/,
    facebook: /facebook.com\/.+?\/posts\/([0-9].+)/,
    instagram: /instagram.com\/p\/([a-zA-Z0-9].+)/
}

export default class SocialBlock extends React.Component {
    constructor(props) {
        super(props)

        this.loadOEmbed = this.loadOEmbed.bind(this)

        this.state = {
            html: ""
        }
    }

    componentDidMount() {
        const { url } = this.props
        
        if (!url) { return }

        if (url.match(networks["twitter"])) {
            this.loadOEmbed(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`).then(() => {
                loadScript("//platform.twitter.com/widgets.js", () => {
                    twttr.widgets.load()
                })
            })
        } else if (url.match(networks["facebook"])) {
            this.loadOEmbed(`https://www.facebook.com/plugins/post/oembed.json/?url=${encodeURIComponent(url)}`).then(() => {
                loadScript("//connect.facebook.net/nl_NL/all.js#xfbml=1&version=v2.9", () => {
                    FB.XFBML.parse()
                })
            })
        } else if (url.match(networks["instagram"])) {
            this.loadOEmbed(`https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}&omitscript=true`).then(() => {
                loadScript("//platform.instagram.com/nl_NL/embeds.js", () => {
                    instgrm.Embeds.process()
                })
            })
        }
    }

    loadOEmbed(url) {
        return fetchJsonp(url).then((response) => {
            return response.json()
        }).then((data) => {
            this.setState({ html: data.html })
        })
    }

    render() {
        return (
            <div ref="widget" style={{maxWidth:"80%", margin:"0 auto"}} dangerouslySetInnerHTML={{__html: this.state.html}} />
        )
    }
}