import { getAllEvents } from '../../helpers/api-util'
import { useRouter } from 'next/router'
import EventList from '../../components/events/event-list'
import EventsSearch from '../../components/events/events-search'
import { Fragment } from 'react'
import Head from 'next/head'

function AllEventsPage(props) {
  const router = useRouter()

  const { events } = props

  //动态路由参数
  function findEventsHandler(year, month) {
    const fullPath = `/events/${year}/${month}`
    router.push(fullPath)
  }
  return (
    <Fragment>
      {/* onSearch EventsSearch子组件向父组件传递方法 */}
      <Head>
        <title>所有活动</title>
        <meta
          name="description"
          content="找好活动，办好活动，上活动行！"
        ></meta>
      </Head>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </Fragment>
  )
}

export default AllEventsPage

//getStaticProps服务器静态数据获取预渲染
export async function getStaticProps() {
  const events = await getAllEvents()

  if (!events) {
    return { notFound: true }
  }

  return {
    props: {
      events: events,
    },
    // 间隔获取数据60秒刷新
    revalidate: 60,
  }
}
