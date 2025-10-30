window.onload = function () {
  customElements.define('hz-view', View, { extends: 'main' })
  const view = document.createElement('main', { is: 'hz-view' })
  view.initialize()
  document.querySelector('body').prepend(view)
}
