import React, { useEffect, useRef } from 'react';

interface InfiniteScrollLoaderProps {
  onVisible: () => void;
}

const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({ onVisible }) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [onVisible]);

  return <div ref={loaderRef} style={{ height: '1px' }} />;
};

export default InfiniteScrollLoader;
