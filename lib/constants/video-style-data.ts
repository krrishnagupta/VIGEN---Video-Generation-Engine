export interface VideoStyle {
  id: string
  name: string
  image: string
}

export const VIDEO_STYLES: VideoStyle[] = [
  {
    id: "vs_3d_render",
    name: "3D Render",
    image: "/video-style/video-style/3d-render.png"
  },
  {
    id: "vs_anime",
    name: "Anime",
    image: "/video-style/video-style/anime.png"
  },
  {
    id: "vs_cinematic",
    name: "Cinematic",
    image: "/video-style/video-style/cinematic.png"
  },
  {
    id: "vs_cyberpunk",
    name: "Cyberpunk",
    image: "/video-style/video-style/cyberpunk.png"
  },
  {
    id: "vs_gta",
    name: "GTA",
    image: "/video-style/video-style/gta.png"
  },
  {
    id: "vs_realistic",
    name: "Realistic",
    image: "/video-style/video-style/realistic.png"
  }
]
