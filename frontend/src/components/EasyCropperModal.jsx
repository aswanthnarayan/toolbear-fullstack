import React, { useState, useRef } from 'react';
import { Cropper } from 'react-cropper';
import "cropperjs/dist/cropper.css";
import { Button, Dialog, IconButton, Select, Option } from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ASPECT_RATIOS = {
  '1:1': 1,
  '4:3': 4/3,
  '16:9': 16/9,
  '3:2': 3/2,
  '2:3': 2/3,
  'Free': NaN,
};

const EasyCropperModal = ({ open, onClose, image, onCropComplete }) => {
  const cropperRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      croppedCanvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(URL.createObjectURL(blob));
          onClose();
        }
      });
    }
  };

  const handleZoomChange = (value) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoomTo(value);
      setZoom(value);
    }
  };

  const handleRotationChange = (value) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotateTo(value);
      setRotation(value);
    }
  };

  const handleAspectRatioChange = (value) => {
    setAspectRatio(value);
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setAspectRatio(ASPECT_RATIOS[value]);
    }
  };

  return (
    <Dialog
      size="xl"
      open={open}
      handler={onClose}
      className="bg-transparent shadow-none"
    >
      <div className="relative h-[600px] w-full rounded-lg bg-white">
        <div className="flex items-center justify-between bg-blue-gray-50 px-4 py-2 rounded-t-lg">
          <h3 className="text-lg font-semibold text-blue-gray-900">
            Crop Image
          </h3>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={onClose}
          >
            <XMarkIcon strokeWidth={2} className="h-5 w-5" />
          </IconButton>
        </div>
        
        <div className="relative h-[300px] lg:h-[450px] w-full">
          <Cropper
            ref={cropperRef}
            src={image}
            style={{ height: '100%', width: '100%' }}
            aspectRatio={ASPECT_RATIOS[aspectRatio]}
            guides={true}
            viewMode={1}
            dragMode="crop"
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
          />
        </div>

        <div className="flex flex-col gap-3 lg:flex-row justify-between items-center p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className=" ">
              <Select 
                label="Aspect Ratio" 
                value={aspectRatio}
                onChange={handleAspectRatioChange}
                className="bg-white"
                labelProps={{
                  className: "text-sm"
                }}
              >
                {Object.keys(ASPECT_RATIOS).map((ratio) => (
                  <Option key={ratio} value={ratio}>
                    {ratio}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex lg:flex-col gap-2">
              <label className="text-sm">Zoom: {zoom.toFixed(2)}x</label>
              <input
                type="range"
                value={zoom}
                min={0}
                max={3}
                step={0.1}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-32"
              />
            </div>
            <div className="flex lg:flex-col gap-2">
              <label className="text-sm">Rotation: {rotation}°</label>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                onChange={(e) => handleRotationChange(parseInt(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              color="red"
              onClick={onClose}
              className="mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              color="blue"
              onClick={handleSave}
            >
              Crop & Save
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EasyCropperModal;