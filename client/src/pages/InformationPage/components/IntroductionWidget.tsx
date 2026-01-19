import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Spinner, Widget } from "~/components/ui";
import parse from "html-react-parser";
import { FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  updatedStart,
  updateFailure,
  updateSuccess,
} from "~/redux/user/userSlice";
import toast from "react-hot-toast";
import { RootState } from "~/redux/store";
import getErrorMessage from "~/utils/errorHandler";
import { IUser } from "~/types";
import { Button } from "~/components/ui/Button";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const IntroductionWidget = ({ currentUser }: { currentUser: IUser }) => {
  const { t } = useTranslation(["settings_page", "common"]);

  const { details = "" } = currentUser;
  const [content, setContent] = useState(details);
  const [isPreview, setIsPreview] = useState(true);
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.user);

  const isContentEmpty = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    return text.length === 0;
  }, [content]);

  const handleSave = async () => {
    dispatch(updatedStart());
    try {
      const data = await userService.updateUser({
        details: content,
      });
      dispatch(updateSuccess(data));
      toast.success(t("common:toasts.introduction_updated_success"));
      setIsPreview(true);
    } catch (err) {
      const message = getErrorMessage(err);
      dispatch(updateFailure(message));
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setContent(details);
    setIsPreview(true);
  };

  return (
    <Widget>
      <Widget.Header>
        {t("information_page.introduction_widget.title")}
      </Widget.Header>
      <Widget.Content>
        {isPreview ? (
          <div className="relative w-full space-y-4 p-4 sm:p-5">
            <div className="min-h-[8rem] sm:min-h-[10rem] sm:pr-24">
              {isContentEmpty ? (
                <p className="text-sm text-muted-foreground sm:text-base">
                  {t("information_page.introduction_widget.empty")}
                </p>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {parse(content)}
                </div>
              )}
            </div>
            <div className="flex justify-end sm:absolute sm:right-4 sm:top-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsPreview(false)}
                className="w-full rounded-md sm:w-auto"
              >
                <FaPencilAlt className="mr-2 h-3 w-3" />
                {t("information_page.introduction_widget.edit_btn")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4 p-4 sm:p-5">
            {/* Editor with border wrapper */}
            <div className="introduction-editor overflow-hidden rounded-lg border border-border bg-field">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={modules}
                className="[&_.ql-container]:min-h-[140px] [&_.ql-container]:border-0 [&_.ql-container]:bg-transparent [&_.ql-editor.ql-blank::before]:text-muted-foreground [&_.ql-editor]:min-h-[140px] [&_.ql-editor]:text-foreground [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border/50 [&_.ql-toolbar]:bg-transparent"
              />
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                <FaTimes className="mr-2 h-3 w-3" />
                {t("common:buttons.cancel")}
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <FaCheck className="mr-2 h-4 w-4" />
                )}
                {t("common:buttons.save_changes")}
              </Button>
            </div>
          </div>
        )}
      </Widget.Content>
    </Widget>
  );
};

export default IntroductionWidget;