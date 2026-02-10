import ReviewListItem from "./ReviewListItem";
import styles from "./ReviewList.module.css";

function ReviewList({ items, onUpdate, onDelete }) {
  return (
    <ul className={styles.reviewList}>
      {items.map((item) => ( // map으로 배열 렌더링
        <li key={item.id}>
          <ReviewListItem item={item} onUpdate={onUpdate} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
