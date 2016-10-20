import React from "react"
import showDate from "../../lib/showDate"

export default class Comment extends React.Component {
    render() {
        return (
            <div className="comment">
                <div className="comment__top">
                    <a href={this.props.owner.url}
                       title="Bekijk profiel"
                       style={{"backgroundImage": "url(" + this.props.owner.icon + ")"}}
                       className="comment__picture">
                    </a>
                    <div className="comment__justify">
                        <a href={this.props.owner.url} title="Bekijk profiel" className="comment__name">
                            {this.props.owner.name}
                        </a>
                        <div className="comment__date">
                            {showDate(this.props.timeCreated)}
                        </div>
                    </div>
                </div>
                <div className="comment__body">
                    {this.props.description}
                </div>
            </div>
        )
    }
}