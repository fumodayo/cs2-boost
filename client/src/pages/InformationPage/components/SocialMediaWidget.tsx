import { useEffect, useMemo, useState } from "react";
import { FaCheck, FaTrashAlt, FaTimes } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";
import { Input, Select, Spinner, Widget } from "~/components/shared";
import { v4 as uuidv4 } from "uuid";
import { SOCIAL_MEDIA } from "~/constants/user";
import { useDispatch, useSelector } from "react-redux";
import {
  updatedStart,
  updateFailure,
  updateSuccess,
} from "~/redux/user/userSlice";
import toast from "react-hot-toast";
import { RootState } from "~/redux/store";
import getErrorMessage from "~/utils/errorHandler";
import { ISocialLink, IUser } from "~/types";
import { Button } from "~/components/shared/Button";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";

interface IEditingSocialLink extends ISocialLink {
  id: string;
  isValid: boolean;
}

const SocialMediaWidget = ({ currentUser }: { currentUser: IUser }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.user);

  const initialLinks = useMemo(
    () =>
      (currentUser.social_links || []).map((link) => ({
        ...link,
        id: link._id || uuidv4(),
        isValid: true,
      })),
    [currentUser.social_links],
  );

  const [socialLinks, setSocialLinks] =
    useState<IEditingSocialLink[]>(initialLinks);

  useEffect(() => {
    setSocialLinks(initialLinks);
  }, [initialLinks]);

  const validateLink = (type: string, link: string): boolean => {
    if (!link.trim()) return false;
    const social = SOCIAL_MEDIA.find((s) => s.value === type);
    return social ? social.regex.test(link.trim()) : false;
  };

  const handleLinkChange = (
    id: string,
    field: "type" | "link",
    value: string,
  ) => {
    setSocialLinks((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          return {
            ...updatedItem,
            isValid: validateLink(updatedItem.type, updatedItem.link),
          };
        }
        return item;
      }),
    );
  };

  const addSocialLink = () => {
    setSocialLinks((prev) => [
      ...prev,
      { id: uuidv4(), type: "facebook", link: "", isValid: false },
    ]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCancel = () => {
    setSocialLinks(initialLinks);
  };

  const handleSave = async () => {
    const validLinks = socialLinks
      .filter((item) => item.isValid)
      .map(({ type, link }) => ({ type, link }));

    dispatch(updatedStart());
    try {
      const data = await userService.updateUser({
        social_links: validLinks,
      });
      dispatch(updateSuccess(data));
      toast.success("Social links updated successfully!");
    } catch (err) {
      const message = getErrorMessage(err);
      dispatch(updateFailure(message));
      toast.error(message);
    }
  };

  const hasChanges = useMemo(
    () => JSON.stringify(initialLinks) !== JSON.stringify(socialLinks),
    [initialLinks, socialLinks],
  );

  return (
    <Widget>
      <Widget.Header>
        {t("SettingsPage.Information.SocialMediaWidget.title")}
      </Widget.Header>
      <Widget.Content>
        <div className="mb-4 space-y-4">
          {socialLinks.length > 0 ? (
            socialLinks.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center gap-2"
              >
                <div className="relative col-span-7">
                  <Input
                    type="text"
                    value={item.link}
                    onChange={(e) =>
                      handleLinkChange(item.id, "link", e.target.value)
                    }
                    placeholder="https://facebook.com/your-username"
                    className={`pr-8 ${item.link && !item.isValid ? "border-danger focus:border-danger focus:ring-danger" : ""}`}
                  />
                  {item.link && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {item.isValid ? (
                        <FaCheck className="h-4 w-4 text-success" />
                      ) : (
                        <FaTimes className="h-4 w-4 text-danger" />
                      )}
                    </div>
                  )}
                </div>
                <div className="col-span-4">
                  <Select
                    value={item.type}
                    onChange={(e) =>
                      handleLinkChange(item.id, "type", e.target.value)
                    }
                  >
                    {SOCIAL_MEDIA.map(({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="col-span-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:bg-danger/10 hover:text-danger"
                    onClick={() => removeSocialLink(item.id)}
                  >
                    <FaTrashAlt className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {t("SettingsPage.Information.SocialMediaWidget.empty")}
            </p>
          )}

          <Button
            size="lg"
            variant="outline"
            onClick={addSocialLink}
            className="w-full"
          >
            <HiPlus className="mr-2 h-4 w-4" />
            {t("SettingsPage.Information.SocialMediaWidget.addBtn")}
          </Button>

          {hasChanges && (
            <div className="flex justify-end space-x-2 border-t border-border pt-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                {t("Dialog.btn.Cancel")}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={
                  loading || socialLinks.some((l) => l.link && !l.isValid)
                }
              >
                {loading ? (
                  <Spinner size="sm" className="mr-2" />
                ) : (
                  <FaCheck className="mr-2 h-4 w-4" />
                )}
                {t("Dialog.btn.Save Changes")}
              </Button>
            </div>
          )}
        </div>
      </Widget.Content>
    </Widget>
  );
};

export default SocialMediaWidget;
