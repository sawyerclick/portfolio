export default function stabilizeHeight(className) {
  const elements = document.querySelectorAll(className)
  const elementHeights = Array.prototype.map.call(
    elements,
    el => el.clientHeight
  )
  const maxHeight = Math.max.apply(null, elementHeights)
  Array.prototype.forEach.call(
    elements,
    el => (el.style.height = maxHeight + 'px')
  )
}
