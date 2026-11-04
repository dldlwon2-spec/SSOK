import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "문장쏙 | 영어 문장 구조 분석",
    short_name: "문장쏙",
    description: "복잡한 영어 문장도 구조부터 차근차근.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbfbfa",
    theme_color: "#fbfbfa",
    lang: "ko",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
