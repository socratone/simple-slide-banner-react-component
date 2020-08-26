import React, { useEffect, useState } from 'react';

import NavButtons from './navButtons';
import SlideBannerArticle from './slideBannerArticle';
import datas from '../lib/slideBannerData';
import './slideBanner.scss';

const SLIDE_INTERVAL_TIME = 2000;

const articleWrapper = React.createRef();
let bannerIndexVar = 0;

const SlideBanner = () => {
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(function setArticleWrapperWidth() {
    const dataCount = datas.length;
    articleWrapper.current.style.width = getBannerWidth() * dataCount + 'px';
    window.onresize = function () {
      articleWrapper.current.style.width = getBannerWidth() * dataCount + 'px';
      setBannerOrder(bannerIndexVar);
    };
    return () => {
      window.onresize = function () {};
    };
  }, []);

  useEffect(function setAutoSlideArticle() {
    const endIndex = datas.length - 1;
    const id = setInterval(() => {
      setBannerOrder(endIndex <= bannerIndexVar ? 0 : bannerIndexVar + 1);
    }, SLIDE_INTERVAL_TIME);
    return () => {
      clearInterval(id);
    };
  }, []);

  const getBannerWidth = () => {
    return articleWrapper.current.parentElement.offsetWidth;
  };

  const setBannerOrder = (index) => {
    if (index === 0) setAnimationToSlideAtEnd();
    else setAnimationToSlide(getBannerWidth() * index);

    bannerIndexVar = index;
    setBannerIndex(index);
  };

  const setAnimationToSlide = (scrollLeft) => {
    const id = setInterval(() => {
      const slider = articleWrapper.current.parentElement;
      slider.scrollLeft += 10;
      if (slider.scrollLeft >= scrollLeft) {
        clearInterval(id);
      }
    }, 1);
  };

  const setAnimationToSlideAtEnd = () => {
    const id = setInterval(() => {
      const slider = articleWrapper.current.parentElement;
      slider.scrollLeft -= datas.length * 10;
      if (slider.scrollLeft === 0) {
        clearInterval(id);
      }
    }, 1);
  };

  return (
    <section className="slide-banner">
      <NavButtons
        datas={datas}
        bannerIndex={bannerIndex}
        setBannerOrder={setBannerOrder}
      />
      <div className="slide-banner__constant-ratio-wrapper">
        <div className="slide-banner__constant-ratio-div">
          <div className="slide-banner__article-wrapper" ref={articleWrapper}>
            {datas.map((data) => (
              <SlideBannerArticle key={data.id} data={data} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SlideBanner;
