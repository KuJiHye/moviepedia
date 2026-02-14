import { useCallback, useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredItems = items.filter( // filter로 원하는 조건을 만족하는 요소들만 필터링해서 새로운 배열 생성
    (item) => item.title.includes(keyword) // includes로 문자열에 특정 문자열이 포함되는지 확인
  );

  // 데이터를 받아 올 비동기 함수
  // 매번 새롭게 생성되는 함수는 디펜던시 리스트로 쓸 수 없기 때문에 useCallback 훅으로 함수를 고정
  const handleLoad = useCallback(async (orderParam) => {
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
  }, []);

  // 데이터를 더 받아 오기 위한 함수
  const handleLoadMore = async () => {
    let data = null;
    setIsLoading(true);
    setError(null);

    try { // 로딩 처리
      const response = await axios.get("/film-reviews", {
        params: {
          order,
          offset: items.length,
          limit: LIMIT,
        },
      });
      data = response.data;
    } catch (error) { // 에러 처리
      setError(error);
    } finally {
      setIsLoading(false);
    }

    if (!data) return; // 에러가 나서 데이터가 없을 경우 함수 종료
    
    const { reviews, paging } = data;
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
  }, [order, handleLoad]); // 빠짐 없는 디펜던시 규칙을 지키기 위해 디펜던시 추가

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
      {hasNext && <Button disabled={isLoading} onClick={handleLoadMore}>{t("load more")}</Button>}
      {error && <div>오류가 발생했습니다.</div>}
    </Layout>
  );
}

export default App;
