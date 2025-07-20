'use client';

import { useRef, useState, forwardRef } from 'react';
import classes from './image-picker.module.css';
import Image from 'next/image';
import classNames from 'classnames';

const ImagePicker = forwardRef(({ label, name, onChange, inputRef, children }, ref) => {
  const [pickedImage, setPickedImage] = useState(null);
  const localInputRef = useRef();

  const handleClick = () => {
    if (localInputRef.current) {
      localInputRef.current.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };

    fileReader.readAsDataURL(file);

    onChange && onChange(event.target.files);
  };

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div
          className={classNames(classes.preview, { [classes.empty]: !pickedImage })}
          onClick={handleClick}
        >
          {!pickedImage
            ? <p>No image picked yet.</p>
            : <Image src={pickedImage}
              alt="The image selected by user."
              fill
            />
          }
        </div>
        <input
          className={classes.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg, image/webp"
          name={name}
          ref={(e) => {
            localInputRef.current = e;
            inputRef?.(e);
          }}
          onChange={handleImageChange}
        />
        <div>
          <button
            className={classes.button}
            type="button"
            onClick={handleClick}
          >
            Pick an Image
          </button>
          {children}
        </div>
      </div>
    </div>
  );
});

ImagePicker.displayName = "ImagePicker";

export default ImagePicker;