const template = `
  <ul class="nav flex-column">
    <li class="nav-item">
      <a class="nav-link" href="../trab2">
        <span data-feather="chevron-right"></span>
        Trabalho 2
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="../trab3">
        <span data-feather="chevron-right"></span>
        Trabalho 3
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="../trab4/">
        <span data-feather="chevron-right"></span>
        Trabalho 4
      </a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="../trab5/">
        <span data-feather="chevron-right"></span>
        Trabalho 5
      </a>
    </li>
  </ul>
`

class SideBar extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = template
  }

  connectedCallback() {
    const links = this.querySelectorAll(".nav-link")
    const trab = this.getAttribute("trab")

    links[trab-2].classList.add('active')
  }
}

window.customElements.define("side-bar", SideBar)