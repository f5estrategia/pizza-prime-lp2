import { useState } from "react";
import { Play } from "lucide-react";

// Os vídeos ainda estão no Drive (vão para YouTube/Vimeo/Panda depois: é só
// trocar a URL de `embed`). Até o clique, só a miniatura carrega: o player do
// Drive pesa e não pode atrasar a página.

export interface Video {
  titulo: string;
  legenda: string;
  capa: string;
  embed: string;
  proporcao: "vertical" | "horizontal";
}

export const embedDrive = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

const VideoDepoimento = ({ video }: { video: Video }) => {
  const [tocando, setTocando] = useState(false);
  const aspecto = video.proporcao === "vertical" ? "aspect-[3/4]" : "aspect-video";

  return (
    <figure className="m-0">
      <div className={`relative ${aspecto} rounded-xl overflow-hidden bg-black`}>
        {tocando ? (
          <iframe
            src={video.embed}
            title={video.titulo}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button type="button" onClick={() => setTocando(true)} className="group absolute inset-0 w-full h-full" aria-label={`Assistir: ${video.titulo}`}>
            <img src={video.capa} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 text-[#0E0E0E] ml-1" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2">
        <span className="block font-bold text-white text-sm">{video.titulo}</span>
        <span className="block text-white/55 text-xs">{video.legenda}</span>
      </figcaption>
    </figure>
  );
};

export default VideoDepoimento;
