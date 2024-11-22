"use client";

import Appbtn from "../Appbtn/Appbtn";
import "./Slide.css";

import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

const Slide = (props) => {
  const { className } = props;
  if (!props.slide) return <div>cargando....</div>;
// s
  return (
    <div className={className}>
      {/* {props.img2 && (
        <div className="img2">
          <img src={urlForImage(props.slide.img2.asset._ref).url()} alt="" />
        </div>
      )} */}
      {props.activebuttontitle && (
        <div className="slidecont ">
          <div className="slidetitles">
            <h3 className=" text-white">{props.slide.subtitulo}</h3>
            <h1 className="text-2xl font-bold uppercase text-white">
              {props.slide.titulo}
            </h1>
          </div>
          <Link href={props.slide.link}>
            <Appbtn
              text={props.slide.btntext}
              className="capitalize"
              icon="fal fa-chevron-right"
            />
          </Link>
        </div>
      )}
      <Link href={props.slide.urlslider} className="img2">
        <img
          src={urlForImage(props.slide.imgdeskt.asset._ref).url()}
          alt=""
          className="hidden xl:block"
        />

        <img
          src={urlForImage(props.slide.imgtab?.asset._ref).url()}
          className="hidden md:block lg:block xl:hidden"
          alt=""
        />
        <img
          src={urlForImage(props.slide.imgmob.asset._ref).url()}
          className="block md:hidden lg:hidden xl:hidden"
          alt=""
        />
      </Link>
      {/* <img src={props.slide.img2.asset._ref} alt="" />      */}
    </div>
  );
};
export default Slide;
