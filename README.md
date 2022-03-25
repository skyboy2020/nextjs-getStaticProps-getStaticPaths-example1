pages/index.js
pages/index.js
index.js 首页不是高频变化的数据
所以用 getStaticProps 服务器静态数据获取预渲染

---

pages/events/[...slug].js
useSWR,useEffect,getServerSideProps 客户端服务端数据渲染
客户端如何渲染<Head></Head>

pages/events/[eventId].js
getStaticProps + getStaticPaths 静态数据获取渲染
