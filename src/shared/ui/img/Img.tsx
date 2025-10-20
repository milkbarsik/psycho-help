import { useState } from 'react';
import type { FC } from 'react';
import { OptimizedImage } from '../optimized-image';

interface Props {
  className: string;
  photo?: string;
  altPhoto: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const Img: FC<Props> = ({ 
  className, 
  photo, 
  altPhoto, 
  width, 
  height, 
  priority = false 
}) => {
  const [imgSrc, setImgSrc] = useState(photo);

  const handleError = () => {
    setImgSrc(altPhoto);
  };

  if (!imgSrc) {
    return (
      <div
        className={className}
        style={{ 
          backgroundImage: `url(${altPhoto})`,
          width,
          height 
        }}
      />
    );
  }

  return (
    <OptimizedImage
      src={imgSrc}
      alt=""
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
    />
  );
};

export default Img;
