export interface CaptionStyle {
  id: string
  name: string
  description: string
}

export const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: "cs_pop",
    name: "Pop",
    description: "Words pop up playfully"
  },
  {
    id: "cs_fade",
    name: "Fade",
    description: "Smooth cinematic fade in"
  },
  {
    id: "cs_slide",
    name: "Slide Up",
    description: "Words slide up from below"
  },
  {
    id: "cs_highlight",
    name: "Highlight",
    description: "Background highlights the active word"
  },
  {
    id: "cs_typewriter",
    name: "Typewriter",
    description: "Letters type out one by one"
  },
  {
    id: "cs_karaoke",
    name: "Karaoke",
    description: "Text fills with color progressively"
  }
]
