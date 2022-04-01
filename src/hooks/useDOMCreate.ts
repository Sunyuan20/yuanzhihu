import { onUnmounted } from 'vue'
function useDOMCreate (nodeId: string) {
  // 组件还未加载的时候手动添加一个节点
  const node = document.createElement('div')
  node.id = nodeId
  document.body.appendChild(node)
  onUnmounted(() => {
    document.body.removeChild(node)
    // 组件卸载的时候手动删除该节点
  })
}
export default useDOMCreate
