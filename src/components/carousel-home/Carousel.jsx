"use client";

import React, { useEffect, useState } from "react";

import Slide from "./Slide/Slide";
import "./Carousel.css";
import { useCart } from "react-use-cart";

const Carousel = ({ dataSlider }) => {
  const [timeduration] = useState(8000);
  const [play, setPlay] = useState(true);
  const [pos, setPos] = useState(0);
  const slidesrow = dataSlider.slider?.map((slide, i) => {
    return (
      <Slide
        key={i}
        className={`slide  leftimg ${
          pos % dataSlider.slider.length === i && "active"
        }`}
        slide={slide}
        pos={pos}
      />
    );
  });
  const carouselnavrow = dataSlider.slider.map((slide, i) => {
    return (
      <div
        key={i}
        className={`carouselitem ${
          pos % dataSlider.slider.length === i && "activecarouselitem"
        }`}
        onClick={() => {
          setPos(i);
          setPlay(false);
          setTimeout(() => {
            setPlay(true);
          }, 0);
        }}
      >
        <div className="butt">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
            />
          </svg>
        </div>
      </div>
    );
  });

  const [elap, setElap] = useState(0);
  useEffect(() => {
    setPos(0);
  }, []);
  useEffect(() => {
    let timer;
    let elap;
    if (play) {
      timer = setInterval(() => {
        setPos((prev) => prev + 1);
        setElap(0);
      }, timeduration);
      elap = setInterval(() => {
        setElap((prev) => prev + 1);
      }, 1);
    } else {
      clearInterval(timer);
      clearInterval(elap);
      setElap(0);
    }
    return () => {
      clearInterval(timer);
      clearInterval(elap);
      setElap(0);
    };
  }, [play, timeduration]);

  const { emptyCart } = useCart();
  useEffect(() => {
    emptyCart();
  }, []);

  return (
    <>
      <div className="carouselbanner">
        {/* <div className="progress">
        <div className="prog" style={{width: (elap*400)/(timeduration)+'%'}}></div>
      </div> */}
        <div className="slides">{slidesrow}</div>
        <div className="carouselcontrols">
          {carouselnavrow}
          <div className="pause">
            <button onClick={() => setPlay(!play)}>
              {play ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  />
                </svg>
              )}
            </button>
            {/* <i
              onClick={() => setPlay(!play)}
              className={play ? "fal fa-pause" : "fal fa-play"}
            ></i> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default Carousel;
