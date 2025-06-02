import { useEffect, useState } from "react";
import { FaCheck, FaTrashAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { Button, Input, Select, Widget } from "~/components/shared";
import { v4 as uuidv4 } from "uuid";
import { SOCIAL_MEDIA } from "~/constants/user";
import { useDispatch } from "react-redux";
import {
  updatedStart,
  updateFailure,
  updateSuccess,
} from "~/redux/user/userSlice";
import { axiosAuth } from "~/axiosAuth";
import toast from "react-hot-toast";
import { ICurrentUserProps, ISocialLinkProps } from "~/types";

interface ISocialMediaLink extends ISocialLinkProps {
  isValid?: boolean;
}

const SocialMediaWidget = ({
  currentUser,
}: {
  currentUser?: ICurrentUserProps;
}) => {
  const [socialLinks, setSocialLinks] = useState<ISocialMediaLink[]>([]);
  const dispatch = useDispatch();

  const { social_links = [] } = currentUser || {};

  useEffect(() => {
    setSocialLinks(
      social_links.length > 0
        ? social_links.map((link) => ({
            ...link,
            isValid: validateLink(link.type, link.link),
          }))
        : [{ id: uuidv4(), type: "facebook", link: "", isValid: false }],
    );
  }, [social_links]);

  // Kiểm tra link hợp lệ dựa trên type
  const validateLink = (type: string, link: string) => {
    const social = SOCIAL_MEDIA.find((s) => s.value === type);
    return social ? social.regex.test(link.trim()) : false;
  };

  // Cập nhật link & kiểm tra hợp lệ ngay lập tức
  const updateSocialLink = (
    id: string,
    field: keyof ISocialMediaLink,
    value: string,
  ) => {
    setSocialLinks((prev) =>
      prev.map((link) =>
        link.id === id
          ? {
              ...link,
              [field]: value,
              isValid: validateLink(
                field === "type" ? value : link.type,
                field === "link" ? value : link.link,
              ),
            }
          : link,
      ),
    );
  };

  // Xóa social link
  const removeSocialLink = (id: string) => {
    setSocialLinks((prev) => {
      const updatedLinks = prev.filter((link) => link.id !== id);
      return updatedLinks.length > 0
        ? updatedLinks
        : [{ id: uuidv4(), type: "facebook", link: "", isValid: false }];
    });
  };

  // Lọc ra các link hợp lệ & không trùng lặp
  const validateAndCleanLinks = () => {
    const uniqueLinks = new Set();
    return socialLinks.filter(({ link, isValid }) => {
      if (!isValid) return false;
      if (uniqueLinks.has(link)) return false;
      uniqueLinks.add(link);
      return true;
    });
  };

  // Lưu link
  const handleSave = async () => {
    const cleanedData = validateAndCleanLinks();
    setSocialLinks(cleanedData.length > 0 ? cleanedData : []);
    try {
      dispatch(updatedStart());
      const { data } = await axiosAuth.post(
        `/user/update/${currentUser?._id}`,
        {
          social_links: cleanedData,
        },
      );
      console.log({ data });
      dispatch(updateSuccess(data));
      toast.success("Edit Successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      dispatch(updateFailure(message));
    }
  };

  // Hủy bỏ thay đổi
  const handleCancel = () => {
    setSocialLinks(
      social_links.length > 0
        ? social_links.map((link) => ({
            ...link,
            isValid: validateLink(link.type, link.link),
          }))
        : [{ id: uuidv4(), type: "facebook", link: "", isValid: false }],
    );
  };

  return (
    <Widget>
      <Widget.Header>Social Media</Widget.Header>
      <Widget.Content>
        <div className="space-y-3 rounded-md p-4">
          {socialLinks.map(({ id, type, link, isValid }) => (
            <div key={id} className="flex items-center space-x-2">
              <Input
                type="text"
                value={link}
                onChange={(e) => updateSocialLink(id, "link", e.target.value)}
                placeholder="Enter social media link..."
                className={`border ${
                  link && !isValid ? "border-red-500" : "border-gray-300"
                }`}
              />
              <Select
                value={type}
                className="flex w-full rounded-md border border-input bg-card-alt px-3 py-1.5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                onChange={(e) =>
                  updateSocialLink(
                    id,
                    "type",
                    e.target.value as ISocialMediaLink["type"],
                  )
                }
              >
                {SOCIAL_MEDIA.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Button
                className="rounded-md bg-danger-light px-3 py-1.5 text-xs text-white hover:bg-danger-light-hover"
                onClick={() => removeSocialLink(id)}
              >
                <FaTrashAlt size={18} />
              </Button>
            </div>
          ))}
          <Button
            variant="primary"
            onClick={() =>
              setSocialLinks([
                ...socialLinks,
                { id: uuidv4(), type: "facebook", link: "", isValid: false },
              ])
            }
            className="w-full rounded-md px-4 py-2 text-sm"
          >
            + Add a social link
          </Button>
          <div className="flex space-x-2">
            <Button
              disabled={!socialLinks.some((l) => l.isValid)}
              variant="primary"
              onClick={handleSave}
              className="rounded-md px-4 py-2 text-sm"
            >
              <FaCheck size={18} className="mr-1" />
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="rounded-md px-4 py-2 text-sm"
            >
              <MdClose size={18} className="mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </Widget.Content>
    </Widget>
  );
};

export default SocialMediaWidget;
