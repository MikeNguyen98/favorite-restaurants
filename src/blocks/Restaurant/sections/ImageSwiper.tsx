import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { isEmpty } from "lodash";
import React from "react";

type Props = {
  images: string[];
  name: string;
};

const ImageSwiper = ({ images, name }: Props) => {
  return (
    <Swiper pagination={true} modules={[Pagination]} className="h-full w-full">
      {!isEmpty(images) ? (
        images.map((img: string, index: number) => (
          <SwiperSlide key={`${img}-${index}`}>
            <Image
              src={img}
              alt={name || "Restaurant image"}
              fill
              className="rounded-lg sm:rounded-2xl object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/assets/fallbackImage.png";
                e.currentTarget.srcset = "/assets/fallbackImage.png";
                e.currentTarget.onerror = null;
              }}
            />
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <div className="w-full h-full bg-gray-200 rounded-lg sm:rounded-2xl flex items-center justify-center">
            <span className="text-gray-400 text-sm sm:text-base">No Image</span>
          </div>
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default React.memo(ImageSwiper);
