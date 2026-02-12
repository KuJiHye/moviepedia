import { useEffect, useRef } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";
import styles from "./ReviewForm.module.css";
import placeholderImage from "../assets/placeholder.png";
import useTranslate from "../hooks/useTranslate";

function ReviewForm({
  review = {
    title: "",
    imgUrl: "",
    rating: 1,
    content: "",
  },
  onSubmit,
}) {
  const t = useTranslate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form className={styles.form} action={onSubmit}>
      <img src={placeholderImage} />
      <div className={styles.content}>
        <div className={styles.titleRating}>
          <Input
            className={styles.title}
            name="title"
            defaultValue={review.title}
            placeholder={t("review title placeholder")}
            ref={inputRef}
          />
          <Select
            name="rating"
            defaultValue={review.rating}
            placeholder={t("review rating placeholder")}
          >
            <option value={1}>★</option>
            <option value={2}>★★</option>
            <option value={3}>★★★</option>
            <option value={4}>★★★★</option>
            <option value={5}>★★★★★</option>
          </Select>
        </div>
        <Textarea
          className={styles.textarea}
          name="content"
          defaultValue={review.content}
          placeholder={t("review content placeholder")}
        />
        <Button className={styles.button}>{t("submit button")}</Button>
      </div>
    </form>
  );
}

export default ReviewForm;
