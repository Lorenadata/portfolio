import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Qué enseñar si algo de dentro falla (una imagen o un trozo de código que no llega, WebGL que no arranca…). */
  fallback: ReactNode
  onError?(error: Error): void
}

/** Evita que un fallo de carga deje toda la web en negro: sustituye solo la parte que ha fallado. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
