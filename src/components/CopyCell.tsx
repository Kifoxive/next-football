import { IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface CopyCellProps {
  text: string;
  maxLength?: number;
}

export const CopyCell: React.FC<CopyCellProps> = ({ text, maxLength = 40 }) => {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Clipboard error", err);
    }
  };

  const truncatedText =
    text.length > maxLength ? text.slice(0, maxLength) + "…" : text;

  return (
    <div className="flex items-center gap-2">
      <span className="max-w-[200px] truncate" title={text}>
        {truncatedText}
      </span>
      <Tooltip
        title={copied ? "copied" : "copy"}
        // closeDelay={0}
        content={copied ? t("basic.copied") : t("basic.copy")}
      >
        <IconButton onClick={handleCopy}>
          {/* <Copy className="w-4 h-4" /> */}
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
};
