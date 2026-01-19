import { useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FiMail, FiEye, FiSave, FiCode, FiSend } from "react-icons/fi";
import { Heading, Helmet, Input } from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { adminService } from "~/services/admin.service";
import getErrorMessage from "~/utils/errorHandler";
import { Dialog, DialogContent } from "~/components/@radix-ui/Dialog";
interface IEmailTemplate {
  _id: string;
  name: string;
  subject: string;
  html_content: string;
  variables: string[];
  description?: string;
  is_active: boolean;
}
const EmailTemplatesPage = () => {
  const { t } = useTranslation("email_templates_page");
  const [selectedTemplate, setSelectedTemplate] =
    useState<IEmailTemplate | null>(null);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedHtml, setEditedHtml] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { data, isLoading, mutate } = useSWR(
    "/admin/email-templates",
    adminService.getEmailTemplates,
  );
  const { trigger: triggerUpdate, isMutating } = useSWRMutation(
    "/admin/email-templates/update",
    async () => {
      if (!selectedTemplate) return;
      return adminService.updateEmailTemplate(selectedTemplate._id, {
        subject: editedSubject,
        html_content: editedHtml,
      });
    },
  );
  const templates: IEmailTemplate[] = data?.data || [];
  const handleSelectTemplate = (template: IEmailTemplate) => {
    setSelectedTemplate(template);
    setEditedSubject(template.subject);
    setEditedHtml(template.html_content);
  };
  const handleSave = async () => {
    try {
      await triggerUpdate();
      toast.success(t("toasts.template_updated"));
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  const handlePreview = () => {
    if (!selectedTemplate) return;
    let html = editedHtml;
    const sampleVariables: Record<string, string> = {
      username: "John Doe",
      password: "Abc@123456",
      otp: "123456",
      title: "Special Promotion!",
      content: "Check out our latest offers and exclusive deals!",
      image:
        "https://via.placeholder.com/600x200/1e1e24/3b82f6?text=Banner+Image",
      orderTitle: "Premier Rank Boost",
      orderAmount: "500,000 ₫",
      transactionId: "14123456789",
      paymentDate: "29/12/2024 09:30",
      boostId: "BOOST-ABC123",
    };
    selectedTemplate.variables.forEach((v) => {
      const value = sampleVariables[v] || "{{" + v + "}}";
      const regex = new RegExp("\\{\\{" + v + "\\}\\}", "g");
      html = html.replace(regex, value);
    });
    setPreviewHtml(html);
    setIsPreviewOpen(true);
  };
  const handleSendAnnouncementEmail = async () => {
    setIsSending(true);
    try {
      const result = await adminService.sendAnnouncementEmail();
      toast.success(result.message || t("toasts.email_sent"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSending(false);
    }
  };
  const getTemplateDisplayName = (name: string) => {
    return t(`template_names.${name}`, name);
  };
  return (
    <>
      <Helmet title={t("title")} />
      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent title={t("email_preview")}>
          <div className="max-h-[80vh] overflow-auto rounded-xl bg-zinc-900 p-4">
            <iframe
              srcDoc={previewHtml}
              className="h-[600px] w-full rounded-lg border-0 bg-white"
              title={t("email_preview")}
            />
          </div>
        </DialogContent>
      </Dialog>
      <div>
        <div className="flex items-center justify-between">
          <Heading icon={FiMail} title={t("title")} subtitle={t("subtitle")} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* Template List */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 font-semibold text-foreground">
                {t("available_templates")}
              </h3>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-lg bg-muted"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template._id}
                      onClick={() => handleSelectTemplate(template)}
                      className={`w-full rounded-lg border p-3 text-left transition-all ${
                        selectedTemplate?._id === template._id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            template.is_active
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          <FiMail />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {getTemplateDisplayName(template.name)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Variables: {template.variables.join(", ")}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Editor */}
          <div className="lg:col-span-8">
            {selectedTemplate ? (
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    {getTemplateDisplayName(selectedTemplate.name)}
                  </h3>
                  <div className="flex gap-2">
                    {selectedTemplate?.name === "announcement" && (
                      <Button
                        className="px-2"
                        variant="secondary"
                        onClick={handleSendAnnouncementEmail}
                        disabled={isSending}
                      >
                        <FiSend className="mr-1" />
                        {isSending
                          ? t("sending")
                          : t("send_announcement_email")}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={handlePreview}
                    >
                      <FiEye className="mr-2" /> {t("preview")}
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSave}
                      disabled={isMutating}
                    >
                      <FiSave className="mr-2" />
                      {isMutating ? t("saving") : t("save_changes")}
                    </Button>
                  </div>
                </div>
                {/* Subject */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("subject")}
                  </label>
                  <Input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                  />
                </div>
                {/* Variables Info */}
                <div className="mb-4 rounded-lg bg-blue-500/10 p-3">
                  <p className="text-sm text-blue-400">
                    <FiCode className="mr-2 inline" />
                    {t("available_variables")}:{" "}
                    {selectedTemplate.variables
                      .map((v) => "{{" + v + "}}")
                      .join(", ")}
                  </p>
                </div>
                {/* HTML Editor */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    {t("html_content")}
                  </label>
                  <textarea
                    value={editedHtml}
                    onChange={(e) => setEditedHtml(e.target.value)}
                    rows={20}
                    className="font-mono w-full rounded-lg border border-border bg-zinc-900 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border bg-card">
                <p className="text-muted-foreground">{t("select_template")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default EmailTemplatesPage;