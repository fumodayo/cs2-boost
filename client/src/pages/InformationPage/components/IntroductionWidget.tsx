import { useMemo, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Spinner, Widget } from "~/components/shared";
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
import { Button } from "~/components/shared/Button";
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
  const { t } = useTranslation();
  const { details = "" } = currentUser;
  const [content, setContent] = useState(details);
  const [isPreview, setIsPreview] = useState(true);
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.user);

  const isContentEmpty = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    return text.length === 0;
  }, [content]);

  const isContentChanged = content !== details;

  const handleSave = async () => {
    dispatch(updatedStart());
    try {
      const data = await userService.updateUser({
        details: content,
      });
      dispatch(updateSuccess(data));
      toast.success("Introduction updated successfully!");
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
        {t("SettingsPage.Information.IntroductionWidget.title")}
      </Widget.Header>
      <Widget.Content>
        {isPreview ? (
          <div className="group relative min-h-[12rem] w-full space-y-4 rounded-lg p-5">
            {isContentEmpty ? (
              <p className="text-muted-foreground">
                {t("SettingsPage.Information.IntroductionWidget.empty")}
              </p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {parse(content)}
              </div>
            )}
            <div className="absolute right-4 top-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsPreview(false)}
                className="rounded-md"
              >
                <FaPencilAlt className="mr-2 h-3 w-3" />
                {t("SettingsPage.Information.IntroductionWidget.editBtn")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full space-y-4 rounded-lg p-5">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-40 rounded-md pb-10"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancel}
                disabled={!isContentChanged || loading}
                className="rounded-md"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                {t("Dialog.btn.Cancel")}
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleSave}
                disabled={!isContentChanged || loading}
                className="rounded-md"
              >
                {loading ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <FaCheck className="mr-2 h-4 w-4" />
                )}
                {t("Dialog.btn.Save Changes")}
              </Button>
            </div>
          </div>
        )}
      </Widget.Content>
    </Widget>
  );
};

export default IntroductionWidget;
