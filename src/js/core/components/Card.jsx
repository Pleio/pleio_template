import React from 'react'
import { Link } from 'react-router'

export default class Card extends React.Component {
    render() {
        return (
            <div className="col-sm-6 col-lg-4">
                <div className="container-card-title">
                    <Link to={"/news/" + this.props.guid} className="card-tile ___small-card ___maatschappij">
                        <div className="card-tile__image"></div>
                        <div className="card-tile__content">
                            <div className="card-tile__content-justify">
                                <h3 className="card-tile__title">
                                    {this.props.title}
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