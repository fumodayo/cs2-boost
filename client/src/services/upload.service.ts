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

/**
 * @desc Tải lên nhiều file lên server (Cloudinary).
 * @route POST /api/upload/multiple
 * @param files - Mảng các file cần upload (tối đa 10 file)
 */
export const uploadMultipleFiles = async (
  files: File[],
): Promise<{ urls: string[] }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await axiosPrivate.post("/upload/multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
