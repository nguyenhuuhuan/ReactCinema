import React, { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface Props {
  image: File,
  setCropImage: React.Dispatch<React.SetStateAction<string>>,
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function CropImage(props: Props) {
  const [upImg, setUpImg] = useState<any>();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const [aspect, setAspect] = useState<number | undefined>(16 / 9)
  useEffect(() => {
    onSelectFile(props.image);
  }, []);

  const onSelectFile = (file: Blob) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => setUpImg(reader.result));
    reader.readAsDataURL(file);
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  React.useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image: HTMLImageElement = imgRef.current;
    const canvas: HTMLCanvasElement = previewCanvasRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return
    const pixelRatio = window.devicePixelRatio;

    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    const imagee = new Image();
    imagee.src = canvas.toDataURL();
    props.setCropImage(imagee.src);
  }, [completedCrop]);

  return (
    <div className='Crop-Image'>
      <ReactCrop
        aspect={16/9}
        crop={crop}
        onChange={(_, percentCrop) => setCrop(percentCrop)}
        onComplete={(c: PixelCrop) => setCompletedCrop(c)}
      >
        <img
          ref={imgRef}
          src={upImg}
          onLoad={onImageLoad}
          style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
        />
      </ReactCrop>

      <div>
        <canvas
          ref={previewCanvasRef}
          style={{
            width: Math.round(completedCrop && completedCrop.width ? completedCrop.width : 0),
            height: Math.round(completedCrop && completedCrop.height ? completedCrop.height : 0)
          }}
        />
      </div>
    </div>
  );
}
