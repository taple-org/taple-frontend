export type Tag = { id: string; label: string }
export type Trade = { id: string; label: string; }
export type TradeWithTags = Trade & { tags: Tag[] }