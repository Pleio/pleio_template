import React from "react"
import classNames from "classnames"

export default class SocialShare extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isOpen: false,
            url: ""
        }

        this.toggleState = (e) => this.setState({isOpen: !this.state.isOpen})
    }

    componentDidMount() {
        // force re-rendering as server-side rendering is not aware of window.location.href
        if (!this.state.url && (typeof window !== undefined)) {
            this.setState({
                url: window.location.href
            })
        }
    }

    getURL(platform) {
        const { url } = this.state

        switch (platform) {
            case "twitter":
                return `https://twitter.com/intent/tweet?url=${url}`
            case "facebook":
                return `https://www.facebook.com/share.php?u=${url}`
            case "google":
                return `https://plus.google.com/share?url=${url}`
            case "linkedin":
                return `https://www.linkedin.com/shareArticle?mini=true&url=${url}`
            case "mail":
                return `mailto:ontvanger@e-mailadres.nl?subject=Ik wil een pagina met je delen&body=Beste [Naam ontvanger],%0D%0A%0D%0ABekijk de volgende link, volgens mij vind je het interessant: ${url}.%0D%0A%0D%0AGroeten,%0D%0A[Naam verzender]`
        }
    }

    render() {
        return (
            <div className="article-actions__share">
                <div title="Deel" className={classNames({"button article-action ___share": true, " ___is-open": this.state.isOpen})} onClick={this.toggleState}>
                    <span>Deel</span>
                </div>
                <div className={classNames({"article-share": true, " ___is-open": this.state.isOpen})}>
                    <a href={this.getURL("twitter")} target="_blank" className="button__share ___twitter"></a>
                    <a href={this.getURL("facebook")} target="_blank" className="button__share ___facebook"></a>
                    <a href={this.getURL("google")} target="_blank" className="button__share ___google"></a>
                    <a href={this.getURL("linkedin")} target="_blank" className="button__share ___linkedin"></a>
                    <a href={this.getURL("mail")} target="_blank" className="button__share ___mail"></a>
                </div>
            </div>
        )
    }
}