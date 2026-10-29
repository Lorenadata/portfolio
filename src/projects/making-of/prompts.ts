export interface ImagePrompt {
  id: string
  title: string
  text: string
}

/** Lee los prompts de docs/prompts-imagenes.md: cada uno es "## N · `id`: título" seguido de una cita "> …". */
export function parsePrompts(md: string): ImagePrompt[] {
  const out: ImagePrompt[] = []
  const re = /^## \d+ · `([a-z-]+)`: (.+)\r?\n\r?\n> (.+)$/gm
  for (const m of md.matchAll(re)) out.push({ id: m[1], title: m[2].trim(), text: m[3].trim() })
  return out
}
