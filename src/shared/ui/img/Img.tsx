import { FC, useState } from 'react';

interface Props {
  className: string;
  photo?: string;
  altPhoto: string;
}

const Img: FC<Props> = ({ className, photo, altPhoto }) => {
  const [imgSrc, setImgSrc] = useState(photo);

  return (
    <>
      <div
        className={className}
        style={{ backgroundImage: `url(${imgSrc})` }}
        onError={() => setImgSrc(altPhoto)}
      >
        {' '}
      </div>
    </>
  );
};

export default Img;
