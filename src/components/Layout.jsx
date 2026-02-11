import logoImage from "../assets/logo.png";
import styles from "./Layout.module.css";
import LocaleSelect from "./LocaleSelect";
import useTranslate from "../hooks/useTranslate";

function Layout({ children }) {
  const t = useTranslate();

  return (
    <div className={styles.layout}>
      <div className={styles.gnbContainer}>
        <div className={styles.gnb}>
          <img src={logoImage} alt="moviepedia" />
          <LocaleSelect />
        </div>
      </div>
      <div className={styles.main}>{children}</div>
      <div className={styles.footerContainer}>
        <div className={styles.footer}>{t("terms of service")} | {t("privacy policy")}</div>
      </div>
    </div>
  );
}

export default Layout;
