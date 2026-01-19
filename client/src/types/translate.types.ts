export interface PanelItem {
  title: string;
  subtitle: string;
}
export interface Tab {
  heading: string;
  panel: PanelItem[];
  isQuestions?: boolean;
}
export interface FaqItem {
  key: string;
  question: string;
  answer: string;
}
export interface DetailsProps {
  title: string;
  subtitle?: string;
  tabs: Tab[];
  questions?: FaqItem[]; 
}
export interface TabDataFromJSON {
  heading: string;
  items?: Record<string, PanelItem>; 
}
