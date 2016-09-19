import React from 'react'
import ContentHeader from '../elements/ContentHeader'
import InfiniteList from '../elements/InfiniteList'
import Card from '../elements/Card'

export default class News extends React.Component {
    render() {
        return (
            <div>
                <ContentHeader title="Nieuws" />
                <section className="section ___grey">
                    <InfiniteList subtype="news" offset={0} limit={20} />
                </section>
            </div>
        )
    }
}