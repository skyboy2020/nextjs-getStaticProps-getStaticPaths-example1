import { Fragment } from 'react'
import Head from 'next/head'
import { getEventById, getFeaturedEvents } from '../../helpers/api-util'
import EventSummary from '../../components/event-detail/event-summary'
import EventLogistics from '../../components/event-detail/event-logistics'
import EventContent from '../../components/event-detail/event-content'
import ErrorAlert from '../../components/ui/error-alert'
import Button from '../../components/ui/button'

function EventDetailPage(props) {
  const event = props.selectedEvent

  // if (!event) {
  //   return (
  //     <div className='center'>
  //       <p>加载中...</p>
  //     </div>
  //   )
  // }
  return (
    <Fragment>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description}></meta>
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </Fragment>
  )
}

export default EventDetailPage

export async function getStaticProps(context) {
  const eventId = context.params.eventId

  const event = await getEventById(eventId)

  if (!event) {
    return { notFound: true }
  }

  return {
    props: {
      selectedEvent: event,
    },
    //静态数据获取渲染间隔30秒
    revalidate: 30,
  }
}

export async function getStaticPaths() {
  const events = await getFeaturedEvents()

  const paths = events.map((event) => ({
    params: {
      eventId: event.id,
    },
  }))

  return {
    paths: paths,
    fallback: 'blocking',
  }
}
