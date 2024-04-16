import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";

const UploadImage = () => {
  const [previewImage, setPreviewImage] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = URL.createObjectURL(e.target.files[0]);
      setPreviewImage(image);
    }
  };

  return (
    <>
      {previewImage ? (
        <div className="flex gap-x-4">
          <label htmlFor="input-file-image">
            <input
              id="input-file-image"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleImageChange}
            />
            <img
              src={previewImage}
              className="h-14 w-14 rounded-md border border-border object-cover shadow-sm"
            />
          </label>
          <div className="flex flex-col justify-center text-xs text-foreground/80">
            <p>AVATAR</p>
            <p>180 KB</p>
            <span
              onClick={() => setPreviewImage("")}
              className="cursor-pointer text-danger hover:underline"
            >
              Remove
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full cursor-pointer rounded-md border border-border bg-field py-2 hover:bg-border/50">
          <label htmlFor="input-file-image">
            <div className="flex items-center justify-center gap-x-2">
              <input
                id="input-file-image"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="flex items-center justify-center">
                <CiCirclePlus className="text-2xl text-foreground" />
              </div>
              <div className="text-center text-sm leading-4 text-muted-foreground">
                <span>
                  {
                    "Select or drag max 1 file | PNG, JPEG, WEBP, GIF | < 4.88MB"
                  }
                </span>
              </div>
            </div>
          </label>
        </div>
      )}
    </>
  );
};

export default UploadImage;
