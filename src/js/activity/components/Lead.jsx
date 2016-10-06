import React from "react"

export default class Lead extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: true,
            height: 'auto'
        }

        this.onClose = (e) => this.setState({visible: false})
    }


    componentDidMount() {
        setTimeout(() => {
            this.setState({
                height: this.refs.lead.offsetHeight
            })
        }, 5)
    }

    render() {
        let style = {
            height: this.state.height,
            backgroundImage: "url(" + this.props.image + ")"
        }

        if (!this.state.visible) {
            style.marginTop = 0;
            style.opacity = 0;
            style.height = 0;
        }

        return (
            <div style={style} className="lead ___home" ref="lead">
                <div className="lead__close" onClick={this.onClose}>
                </div>
                <div className="lead__justify">
                    <div className="container">
                        <h1 className="lead__title">
                            {this.props.title}
                        </h1>
                        <h2 className="lead__sub-title">
                            {this.props.subtitle}
                        </h2>
                        <div className="buttons ___margin-top ___gutter ___center">
                            <div className="button ___large">
                                Aan de slag
                            </div>
                            <div className="button ___large">
                                Over Leraar.nl
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}