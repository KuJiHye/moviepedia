import { useEffect, useRef } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Textarea from "./Textarea";
import styles from "./ReviewForm.module.css";
import placeholderImage from "../assets/placeholder.png";

function ReviewForm({
  review = {
    title: "",
    imgUrl: "",
    rating: 1,
    content: "",
  },
  onSubmit,
}) {
  const inputRef = useRef(null);

  const submit = (formData) => {
    const data = Object.fromEntries(formData.entries()); // Object.fromEntries로 자바스크립트 객체로 변환
    onSubmit(data);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form className={styles.form} action={submit}>
      <img src={placeholderImage} />
      <div className={styles.content}>
        <div className={styles.titleRating}>
          <Input
            className={styles.title}
            name="title"
            defaultValue={review.title}
            placeholder="제목을 입력해 주세요."
            ref={inputRef}
          />
          <Select
            name="rating"
            defaultValue={review.rating}
            placeholder="별점을 입력해 주세요."
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
          placeholder="내용을 입력해 주세요."
        />
        <Button className={styles.button}>작성완료</Button>
      </div>
    </form>
  );
}

export default ReviewForm;
