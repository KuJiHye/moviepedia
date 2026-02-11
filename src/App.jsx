import { useState } from "react";
import ReviewList from "./components/ReviewList";
import Modal from "./components/Modal";
import ReviewForm from "./components/ReviewForm";
import Button from "./components/Button";
import Input from "./components/Input";
import Layout from "./components/Layout";
import mockItems from "./mock.json";
import styles from "./App.module.css";
import useTranslate from "./hooks/useTranslate";

function App() {
  const t = useTranslate();
  const [items, setItems] = useState(mockItems);
  const [order, setOrder] = useState("createdAt");
  const [keyword, setKeyword] = useState("");
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);

  const sortedItems = items.sort((a, b) => b[order] - a[order]); // sort로 내림차순 정렬

  const filteredItems = sortedItems.filter( // filter로 원하는 조건을 만족하는 요소들만 필터링해서 새로운 배열 생성
    (item) => item.title.includes(keyword) // includes로 문자열에 특정 문자열이 포함되는지 확인
  );

  const handleCreate = (data) => {
    const now = new Date();
    const newItem = {
      id: items.length + 1,
      ...data,
      createdAt: now.valueOf(),
      updatedAt: now.valueOf(),
    };
    setItems([newItem, ...items]);
    setIsCreateReviewOpen(false);
  };

  const handleUpdate = (id, data) => {
    const index = items.findIndex((item) => item.id === id);
    const now = new Date();
    const newItem = {
      ...items[index],
      ...data,
      updatedAt: now.valueOf(),
    };
    const newItems = [
      ...items.slice(0, index),
      newItem,
      ...items.slice(index + 1),
    ];
    setItems(newItems);
  };

  const handleDelete = (id) => {
    const nextItmes = items.filter((item) => item.id !== id);
    setItems(nextItmes);
  };

  return (
    <Layout>
      <div className={styles.buttons}>
        {/* <Input
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력해 주세요."
        /> */}
        <div>
          <Button
            className={styles.orderButton}
            variant={order === "createdAt" ? "primary" : "ghost"}
            onClick={() => setOrder("createdAt")}
          >
            {t("sort by latest")}
          </Button>
          <Button
            className={styles.orderButton}
            variant={order === "rating" ? "primary" : "ghost"}
            onClick={() => setOrder("rating")}
          >
            {t("sort by best")}
          </Button>
        </div>
        <Button
          className={styles.createButton}
          onClick={() => setIsCreateReviewOpen(true)}
        >
          {t("create button")}
        </Button>
        <Modal
          isOpen={isCreateReviewOpen}
          onClose={() => setIsCreateReviewOpen(false)}
        >
          <h2 className={styles.modalTitle}>{t("create review title")}</h2>
          <ReviewForm onSubmit={handleCreate} />
        </Modal>
      </div>
      <ReviewList
        items={filteredItems}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </Layout>
  );
}

export default App;
