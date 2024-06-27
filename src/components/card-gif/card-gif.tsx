import React from "react";

import { Button } from "../ui/button";

export default function CardGif() {
  return (
    <div className="relative">
      <img
        src="https://img.adidas.com.hk/resources/2024/5/BAD/BAD%20BUNNY-feature-pc924x613.jpg"
        alt=""
        className="hidden xl:block"
      />
      <img
        src="https://img.adidas.com.hk/resources/2024/5/BAD/BAD%20BUNNY-feature-mob654x960.jpg"
        alt=""
        className="block xl:hidden"
      />
      {/* <video
        muted={true}
        webkit-playsinline={true}
        playsInline={true}
        preload="auto"
        autoPlay={true}
        loop={true}
        className="laptop:h-full hidden w-[100vw]  xl:block"
      >
        <source
          src={`https://img.adidas.com.hk/resources/2024/5/korn/1920x720.gif`}
          type="video/mp4"
        />
        <track
          src="captions_en.vtt"
          kind="captions"
          srcLang="en"
          label="english_captions"
        />
        <track
          src="captions_es.vtt"
          kind="captions"
          srcLang="es"
          label="spanish_captions"
        />
      </video>
      <video
        muted={true}
        webkit-playsinline={true}
        playsInline={true}
        preload="auto"
        autoPlay={true}
        loop={true}
        className="laptop:h-full block   w-[100vw]  xl:hidden"
      >
        <source
          src={`https://brand.assets.adidas.com/video/upload/f_auto:video,q_auto/if_w_gt_600,w_600/originals_ss24_sl72_mh_m_bd2c93ba87.mp4`}
          type="video/mp4"
        />
        <track
          src="captions_en.vtt"
          kind="captions"
          srcLang="en"
          label="english_captions"
        />
        <track
          src="captions_es.vtt"
          kind="captions"
          srcLang="es"
          label="spanish_captions"
        />
      </video> */}

      <div className="absolute bottom-5 ml-5 xl:bottom-16  xl:ml-20">
        {/* <h3 className="font-extrabold uppercase xl:text-3xl">
          samba especial GAZELLE{" "}
        </h3> */}
        <p className="mt-3">
          Un original, miles de historias que partieron de él.
        </p>
        <Button className="mt-5 rounded-none uppercase">Comprar Ahora</Button>
      </div>
    </div>
  );
}
