import React from "react"
import { Link } from "react-router"
import { getClassFromTags } from "../../lib/helpers"
import classnames from "classnames"

export default class Card extends React.Component {
    render() {
        const { inActivityFeed } = this.props
        const { guid, title, tags, isFeatured, featuredImage } = this.props.entity

        if (!inActivityFeed) {
            if (isFeatured && featuredImage) {
                return (
                    <div className={isFeatured ? "col-sm-12 col-lg-8" : "col-sm-6 col-lg-4"}>
                        <div className="container-card-title">
                            <Link to={"/news/" + guid} className={classnames({"card-tile ___small-card ___full-image ___featured": true, [getClassFromTags(tags)]: true})}>
                                <div className="card-tile__image" style={{backgroundImage: `url('${featuredImage}')`}}>
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
                                </div>
                            </Link>
                        </div>
                    </div>
                )
            } else {
                let image
                if (featuredImage) {
                    image = (
                        <div className="card-tile__image" style={{backgroundImage: `url('${featuredImage}')`}} />
                    )
                } else {
                    image = (
                        <div className="card-tile__placeholder" />
                    )
                }

                return (
                    <div className="col-sm-6 col-lg-4">
                        <div className="container-card-title">
                            <Link to={"/news/" + guid} className={classnames({"card-tile ___small-card": true, "___no-image": (featuredImage ? false : true), [getClassFromTags(tags)]: true})}>
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
        } else {
            if (featuredImage) {
                return (
                    <div className="card-tile-container">
                        <Link to={`/news/${guid}`} className={classnames({"card-tile ___full-image ___small-card": true, "___no-image": (featuredImage ? false : true), [getClassFromTags(tags)]: true})}>
                            <div className="card-tile__image" style={{backgroundImage: `url('${featuredImage}')`}}>
                                <div className="card-tile__content">
                                    <h3 className="card-tile__title">
                                        {title}
                                    </h3>
                                    <div className="read-more">
                                        <div className="read-more__circle"></div>
                                        <span>Lees meer</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            } else {
                return (
                    <div className="card-tile-container">
                        <Link to={`/news/${guid}`} className={classnames({"card-tile ___full-image ___small-card": true, "___no-image": (featuredImage ? false : true), [getClassFromTags(tags)]: true})}>
                            <div className="card-tile__content">
                                <h3 className="card-tile__title">
                                    {title}
                                </h3>
                                <div className="read-more">
                                    <div className="read-more__circle"></div>
                                    <span>Lees meer</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            }
        }
    }
}





