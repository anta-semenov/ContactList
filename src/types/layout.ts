export interface Point {
  readonly x: number
  readonly y: number
}

export interface Size {
  readonly width: number
  readonly height: number
}

export interface LayoutState {
  readonly width: number
  readonly height: number
  readonly topX: number
  readonly topY: number
}
