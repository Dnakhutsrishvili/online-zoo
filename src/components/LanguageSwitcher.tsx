import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLang = (lang: "en" | "ka") => {
    i18n.changeLanguage(lang);
  };

  return (
    <>
      <button onClick={() => changeLang("en")}>EN</button>
      <button onClick={() => changeLang("ka")}>KA</button>
    </>
  );
};
