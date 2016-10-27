import React from "react"
import { Link } from "react-router"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    render() {
        const { guid, title, tags } = this.props.entity

        let image
        if (this.props.image) {
            image = (
                <div className="card-tile__image"></div>
            )
        } else {
            image = (
                <div className="card-tile__placeholder"></div>
            )
        }

        return (
            <div className="col-sm-6 col-lg-4">
                <div className="container-card-title">
                    <Link to={"/news/" + guid} className={classnames({"card-tile ___small-card": true, "___no-image": image, [getClassFromTags(tags)]: true})}>
                        {image}
                        <div className="card-tile__content">
                            <div className="card-tile__content-justify">
                                <h3 className="card-tile__title">
                                    {title}
                                </h3>
                            </div>
                            <div className="read-more">
                                <div className="read-more-circle"></div>
                                <span>Lees meer</span>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}