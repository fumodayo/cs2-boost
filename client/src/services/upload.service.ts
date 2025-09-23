import { axiosPrivate } from "~/axiosAuth";

/**
 * @desc Tải lên một file lên server (Cloudinary).
 * @route POST /api/upload
 */
export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosPrivate.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
