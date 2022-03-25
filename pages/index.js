import Head from 'next/head'
import { getFeaturedEvents } from '../helpers/api-util'
import EventList from '../components/events/event-list'

function HomePage(props) {
  return (
    <div>
      <Head>
        <title>活动行</title>
        <meta
          name="description"
          content="找好活动，办好活动，上活动行！"
        ></meta>
      </Head>
      <EventList items={props.events} />
    </div>
  )
}

export default HomePage

//网站index.js首页不是高频变化的数据
//所以用getStaticProps服务器静态数据获取预渲染
export async function getStaticProps(context) {
  const featuredEvents = await getFeaturedEvents()
  return {
    props: {
      events: featuredEvents,
    },
    // 静态数据获取时间间隔：1800秒 30分钟
    revalidate: 1800,
  }
}
