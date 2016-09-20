import React from 'react'
import ContentHeader from '../elements/ContentHeader'
import InfiniteList from '../elements/InfiniteList'
import Card from '../elements/Card'

export default class News extends React.Component {
    constructor(props) {
        super(props)

        this.onFilter = this.onFilter.bind(this)

        this.state = {
            filter: []
        }
    }

    onFilter(tags) {
        this.setState({
            filter: tags
        })
    }

    render() {
        return (
            <div>
                <ContentHeader title="Nieuws" onFilter={this.onFilter} />
                <section className="section ___grey">
                    <InfiniteList subtype="news" offset={0} limit={20} tags={this.state.filter} />
                </section>
            </div>
        )
    }
}