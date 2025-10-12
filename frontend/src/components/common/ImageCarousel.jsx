import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ImageCarousel = ({ images }) => {
  // Initialize slidesToShow based on current window width
  const getSlidesToShow = () => {
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow);

  // Update slidesToShow on resize or orientation change
  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-lg cursor-pointer hover:bg-opacity-100"
      onClick={onClick}
    >
      <FaChevronRight className="text-gray-800 text-lg" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white p-1 rounded-full shadow-lg cursor-pointer hover:bg-opacity-100"
      onClick={onClick}
    >
      <FaChevronLeft className="text-gray-800 text-lg" />
    </div>
  );

const settings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  arrows: slidesToShow > 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};


  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-6xl px-4 py-8">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="px-2">
              <div className="aspect-[16/9] overflow-hidden rounded-xl shadow-md">
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageCarousel;
