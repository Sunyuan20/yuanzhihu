export interface ColumnProps {
  id: number
  title: string // 标题
  avatar?: string // 头图链接
  description: string // 描述
}
export const testData: ColumnProps[] = [
  {
    id: 1,
    title: '测试标题1', // 标题
    avatar: require('@/assets/logo.png'), // 头图链接
    description: '这是测试1的描述' // 描述
  },
  {
    id: 2,
    title: '测试标题2', // 标题
    avatar: require('@/assets/logo.png'), // 头图链接
    description: '这是测试2的描述' // 描述
  },
  {
    id: 3,
    title: '测试标题3', // 标题
    avatar: require('@/assets/logo.png'), // 头图链接
    description: '这是测试3的描述' // 描述
  },
  {
    id: 4,
    title: '测试标题4', // 标题
    avatar: require('@/assets/logo.png'), // 头图链接
    description: '这是测试4的描述' // 描述
  }
]

export interface PostProps {
  id: number
  title: string
  content: string
  image?: string
  createdAt: string
  columnId: number
}

export const testPosts: PostProps[] = [
  {
    id: 1,
    title: '这是我的第一篇文章',
    content: '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    image: 'http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5ee1980819f4ae08ac78d458.png?x-oss-process=image/resize,m_fill,m_pad,w_200,h_110',
    createdAt: '2020-06-11 10:34:22',
    columnId: 1
  },
  {
    id: 2,
    title: '这是我的第二篇文章',
    content: '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    createdAt: '2020-06-11 10:34:22',
    columnId: 1
  },
  {
    id: 3,
    title: '这是我的第三篇文章',
    content: '"this is a new post you Very often we will need to map routes with the given pattern to the same component. For example we may have a User component which should be rendered for all users but with dif..."',
    image: 'https://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5edcc2329f2b4e28352b75eb.jpg?x-oss-process=image/resize,m_fill,m_pad,w_200,h_110',
    createdAt: '2020-06-11 10:34:22',
    columnId: 1
  }
]
