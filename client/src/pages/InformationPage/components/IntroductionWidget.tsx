import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, Widget } from "~/components/shared";
import parse from "html-react-parser";
import { FaPencilAlt } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { ICurrentUserProps } from "~/types";
import { useDispatch } from "react-redux";
import {
  updatedStart,
  updateFailure,
  updateSuccess,
} from "~/redux/user/userSlice";
import { axiosAuth } from "~/axiosAuth";
import toast from "react-hot-toast";

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const RichTextEditor = ({
  currentUser,
}: {
  currentUser?: ICurrentUserProps;
}) => {
  const { details = "" } = currentUser || {};
  const [content, setContent] = useState(details);
  const [isPreview, setIsPreview] = useState(details.trim().length > 0);
  const [isDisabledContent, setIsDisabledContent] = useState(false);
  const dispatch = useDispatch();

  const isContentEmpty = (content: string) => {
    return content.replace(/<p><br><\/p>/g, "").trim().length === 0;
  };

  useEffect(() => {
    setIsDisabledContent(isContentEmpty(content));
  }, [content]);

  const handleSave = async () => {
    console.log({ content });
    try {
      dispatch(updatedStart());
      const { data } = await axiosAuth.post(
        `/user/update/${currentUser?._id}`,
        {
          details: content,
        },
      );
      console.log({ data });
      dispatch(updateSuccess(data));
      toast.success("Edit Successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      dispatch(updateFailure(message));
    }
  };

  const handleCancel = () => {
    setContent(details);
  };

  return (
    <Widget>
      <Widget.Header>Details</Widget.Header>
      <Widget.Content>
        <div className="w-full space-y-4 rounded-lg p-5 shadow-sm">
          {!isPreview ? (
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-40 rounded-md"
            />
          ) : (
            <div className="rounded-md border bg-secondary p-4 text-secondary-foreground">
              Preview Content:
              {parse(content)}
            </div>
          )}
          <div className="flex justify-end space-x-2 pt-10">
            <Button
              disabled={isDisabledContent}
              variant="secondary"
              className="rounded-md px-4 py-2 text-sm"
              onClick={() => setIsPreview((prevState) => !prevState)}
            >
              {isPreview ? (
                <>
                  <FaPencilAlt className="mr-1.5" />
                  Edit
                </>
              ) : (
                <>
                  <IoEyeOutline className="mr-1.5" />
                  Preview
                </>
              )}
            </Button>
            <Button
              disabled={isDisabledContent}
              variant="secondary"
              onClick={handleCancel}
              className="rounded-md px-4 py-2 text-sm"
            >
              <MdClose size={18} className="mr-1" />
              Cancel
            </Button>
            <Button
              disabled={isDisabledContent}
              variant="primary"
              onClick={handleSave}
              className="rounded-md px-4 py-2 text-sm"
            >
              <FaCheck size={18} className="mr-1" />
              Save
            </Button>
          </div>
        </div>
      </Widget.Content>
    </Widget>
  );
};

export default RichTextEditor;
