// Layout
export { Header, type HeaderProps } from "./layout/Header";
export { Footer, type FooterProps } from "./layout/Footer";
export { PageHead, type PageHeadProps } from "./layout/PageHead";
export {
    buildMetadata,
    type BuildMetadataOptions,
} from "./layout/buildMetadata";

// Overlay
export { MyModal, type MyModalProps } from "./overlay/Modal";
export { HelpPopup, type HelpPopupProps } from "./overlay/HelpPopup";

// Eingaben
export { Dropdown, type DropdownProps } from "./inputs/Dropdown";
export { AddMenu, type AddMenuProps, type AddMenuItem } from "./inputs/AddMenu";

// Navigation
export { MyTabs, type MyTabsProps, type TabType } from "./navigation/Tabs";

// Medien
export { ImagePreview, type ImagePreviewProps } from "./media/ImagePreview";
export { FileInput, type FileInputProps } from "./media/FileInput";
export {
    PreviewFile,
    PlaceholderFile,
    FileContainer,
    FileText,
} from "./media/styled";

// Inhalte
export { Contribution, type ContributionProps } from "./content/Contribution";
export {
    ContributionEditor,
    type ContributionEditorProps,
} from "./content/ContributionEditor";
export { PreviewBoxes, type PreviewBoxesProps } from "./content/PreviewBoxes";

// Kalender
export {
    EventCalendar,
    type EventCalendarProps,
} from "./calendar/EventCalendar";
export {
    CalendarSubscribe,
    type CalendarSubscribeProps,
} from "./calendar/CalendarSubscribe";

// Einwilligung
export {
    CookieConsent,
    type CookieConsentProps,
} from "./consent/CookieConsent";
export {
    NoConsentButton,
    type NoConsentButtonProps,
} from "./consent/NoConsentButton";
export {
    hasConsent,
    setConsent,
    notifyConsentChanged,
    subscribeConsent,
} from "./consent/hasConsent";
export { useConsent } from "./consent/useConsent";

// Sonstiges
export { HorizontalLine } from "./misc/HorizontalLine";
