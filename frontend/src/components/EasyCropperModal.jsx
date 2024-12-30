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

const EasyCropperModal = ({ image, onClose, onCropComplete }) => {
  const cropperRef = useRef(null);
  const [aspectRatio, setAspectRatio] = useState('Free');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleSave = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 1200,  // Max width
        height: 1200, // Max height
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      
      croppedCanvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedImage = URL.createObjectURL(blob);
            onCropComplete(croppedImage);
            onClose();
          }
        },
        'image/jpeg',
        0.8  // Quality
      );
    }
  };

  const handleZoomChange = (value) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoomTo(parseFloat(value));
      setZoom(parseFloat(value));
    }
  };

  const handleRotationChange = (value) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.rotateTo(parseInt(value));
      setRotation(parseInt(value));
    }
  };

  const handleAspectRatioChange = (value) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setAspectRatio(ASPECT_RATIOS[value]);
      setAspectRatio(value);
    }
  };

  return (
    <Dialog
      size="xl"
      open={true}
      handler={onClose}
      className="bg-white p-4"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Crop Image</h3>
        <IconButton
          variant="text"
          color="blue-gray"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </IconButton>
      </div>

      <div className="relative h-[60vh]">
        <Cropper
          ref={cropperRef}
          src={image}
          style={{ height: '100%', width: '100%' }}
          aspectRatio={ASPECT_RATIOS[aspectRatio]}
          guides={true}
          viewMode={1}
          dragMode="move"
          scalable={true}
          cropBoxMovable={true}
          cropBoxResizable={true}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          zoomTo={zoom}
          rotateTo={rotation}
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-4">
        <div className="w-full sm:w-auto">
          <Select 
            label="Aspect Ratio" 
            value={aspectRatio}
            onChange={handleAspectRatioChange}
          >
            {Object.keys(ASPECT_RATIOS).map((ratio) => (
              <Option key={ratio} value={ratio}>
                {ratio}
              </Option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-sm">Zoom:</span>
          <input
            type="range"
            min="0"
            max="3"
            step="0"
            value={zoom}
            onChange={(e) => handleZoomChange(e.target.value)}
            className="w-32"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-sm">Rotate:</span>
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            onChange={(e) => handleRotationChange(e.target.value)}
            className="w-32"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button 
          variant="outlined"
          color="red"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          variant="filled"
          color="blue"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Dialog>
  );
};

export default EasyCropperModal;