import { Fragment, useEffect, useState } from 'react'
import useSWR from 'swr'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getFilteredEvents } from '../../helpers/api-util'
import EventList from '../../components/events/event-list'
import ResultsTitle from '../../components/events/results-title'
import Button from '../../components/ui/button'
import ErrorAlert from '../../components/ui/error-alert'

//因为年份和月份组合很多，所以不适合用getStaticProps静态渲染页面
//所以用下面的useEffect客户端渲染 或 getServerSideProps服务器端渲染(可能耗时比客户端渲染长)
function FilteredEventPage(props) {
  const [loadedEvents, setLoadedEvent] = useState()
  const router = useRouter()
  const filterData = router.query.slug
  //客户端数据获取
  //useSWR 数据获取封装 缓存钩子函数
  const { data, error } = useSWR(
    'https://nextjs-course-36511-default-rtdb.firebaseio.com/events.json'
  )

  useEffect(() => {
    if (data) {
      const events = []

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        })
      }
      setLoadedEvent(events)
    }
  }, [data])

  //客户端渲染如何渲染Head
  let pageHeadData = (
    <Head>
      <title>筛选活动</title>
      <meta name="description" content="过滤活动列表"></meta>
    </Head>
  )

  if (!loadedEvents) {
    return <p className="center">页面加载中...</p>
  }

  //处理捕获的路由参数
  //获取年份
  const filteredYear = filterData[0]
  //获取月份
  const filteredMonth = filterData[1]

  //转换字符串到数字类型
  const numYear = +filteredYear
  const numMonth = +filteredMonth

  //客户端渲染如何渲染Head
  pageHeadData = (
    <Head>
      <title>筛选活动</title>
      <meta
        name="description"
        content={`活动时间为${numYear}-${numMonth}`}
      ></meta>
    </Head>
  )

  //判断是否为有效年份
  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2022 ||
    numYear < 2021 ||
    numMonth > 12 ||
    numMonth < 1 ||
    error
  ) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>无效查询，请重新选择过滤时间！</p>
        </ErrorAlert>

        <div className="center">
          <Button link="/events">查看所有活动</Button>
        </div>
      </Fragment>
    )
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    )
  })

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>抱歉，查找不到该日期的活动内容！</p>
        </ErrorAlert>

        <div className="center">
          <Button link="/events">查看所有活动</Button>
        </div>
      </Fragment>
    )
  }

  //日期格式化
  const date = new Date(numYear, numMonth - 1)
  return (
    <div>
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </div>
  )
}

//服务端渲染
export default FilteredEventPage

// export async function getServerSideProps(context) {
//   const { params } = context
//   const filterData = params.slug

//   //处理捕获的路由参数
//   const filteredYear = filterData[0]
//   const filteredMonth = filterData[1]

//   const numYear = +filteredYear
//   const numMonth = +filteredMonth

//   //判断是否为有效年份
//   if (
//     isNaN(numYear) ||
//     isNaN(numMonth) ||
//     numYear > 2022 ||
//     numYear < 2021 ||
//     numMonth > 12 ||
//     numMonth < 1
//   ) {
//     return {
//       props: {
//         hasError: true,
//       },
//       // notFound: true,
//       // redirect: {
//       //   destination:'/error'
//       // }
//     }
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth,
//   })

//   return {
//     props: {
//       filteredEvents: filteredEvents,
//       date: {
//         year: numYear,
//         month: numMonth,
//       },
//     },
//   }
// }
