import { useEffect, useState } from "react";
import ReviewList from "./components/ReviewList";
import Modal from "./components/Modal";
import ReviewForm from "./components/ReviewForm";
import Button from "./components/Button";
import Input from "./components/Input";
import Layout from "./components/Layout";
import styles from "./App.module.css";
import useTranslate from "./hooks/useTranslate";
import axios from "./utils/axios";

const LIMIT = 5; // 데이터를 5개씩 받아오기 위한 상수

function App() {
  const t = useTranslate();
  const [items, setItems] = useState([]);
  const [order, setOrder] = useState("createdAt");
  const [keyword, setKeyword] = useState("");
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const filteredItems = items.filter( // filter로 원하는 조건을 만족하는 요소들만 필터링해서 새로운 배열 생성
    (item) => item.title.includes(keyword) // includes로 문자열에 특정 문자열이 포함되는지 확인
  );

  // 데이터를 받아 올 비동기 함수
  const handleLoad = async (orderParam) => {
    const response = await axios.get("/film-reviews", {
      params: {
        // 쿼리 스트링 추가
        order: orderParam,
        limit: LIMIT,
      },
    });
    const { reviews, paging } = response.data;
    setItems(reviews);
    setHasNext(paging.hasNext);
  };

  // 데이터를 더 받아 오기 위한 함수
  const handleLoadMore = async () => {
    const response = await axios.get("/film-reviews", {
      params: {
        order,
        offset: items.length,
        limit: LIMIT,
      },
    });
    const { reviews, paging } = response.data;
    setItems((prevItems) => [...prevItems, ...reviews]);
    setHasNext(paging.hasNext);
  };

  const handleCreate = async (data) => {
    const response = await axios.post("/film-reviews", data);
    const { review } = response.data;
    setItems((prevItems) => [review, ...prevItems]);
    setIsCreateReviewOpen(false);
  };

  const handleUpdate = async (id, data) => {
    const response = await axios.patch(`/film-reviews/${id}`, data);
    const { review } = response.data;
    setItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === id);
      return [
        ...prevItems.slice(0, index),
        review,
        ...prevItems.slice(index + 1),
      ];
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`/film-reviews/${id}`);
    setItems((prevItems) => 
      prevItems.filter((item) => item.id !== id)
    );
  };

  // 무한 루프 방지
  useEffect(() => {
    handleLoad(order);
  }, [order]);

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
      {hasNext && <Button onClick={handleLoadMore}>{t("load more")}</Button>}
    </Layout>
  );
}

export default App;
