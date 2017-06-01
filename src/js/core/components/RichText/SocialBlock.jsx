import React from "react"

export default class SocialBlock extends React.Component {
    componentDidMount() {
        twttr.widgets.load()
        instgrm.Embeds.process()
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.props.code }} style={{width:"85%", margin:"0 auto"}} />
        )
    }
}