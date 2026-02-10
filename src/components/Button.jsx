import styles from "./Button.module.css";

function Button({ className = "", variant = "primary", ...props }) { // variant를 만들어서 디자인 설정
  const classNames = `${styles.button} ${styles[variant]} ${className}`;
  return <button className={classNames} {...props} />;
}

export default Button;
