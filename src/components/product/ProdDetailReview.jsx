import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProdDetailReviewModal from "./ProdDetailReviewModal";
import axios from "axios";

const ProdDetailReview = () => {
  const { id } = useParams();
  const [userReview, setUserReview] = useState([]);
  const url = API_JSON_SERVER_URL;
  const isState = useSelector((state) => state.input.isState);
  const user = useSelector((state) => state.input.user);
  const navigate = useNavigate();

  //전체 리뷰 평균점수 계산
  const averageScore =
    userReview.length > 0
      ? (
          userReview.reduce((acc, cur) => acc + (Number(cur.score) || 0), 0) /
          userReview.length
        ).toFixed(1)
      : 0.0;

  //해당 상품 리뷰 작성 여부 확인
  const [hasPurchased, setHasPurchased] = useState(false);
  const ReviewerFn = async () => {
    if (isState) return false;
    try {
      const res = await axios.get(`${url}/productOrders`);
      const myOrders = res.data.filter(
        (my) => my.customer.userEmail === user?.userEmail,
      );
      //주문들 안의 items 배열을 검사
      const hasItem = myOrders.some((order) =>
        order.items.some((it) => String(it.itemId) === String(id)),
      );
      setHasPurchased(hasItem);
      return;
    } catch (err) {
      alert(err);
      return false;
    }
  };

  useEffect(() => {
    ReviewerFn();
  }, [id, user?.userEmail, isState]);

  //사용자후기 불러오기
  const getReviewFn = async () => {
    try {
      const res = await axios.get(`${url}/productReview`);
      const filtered = res.data.filter((el) => el.productId === id);
      console.log("필터링 결과:", filtered);
      setUserReview(Array.isArray(filtered) ? filtered : [filtered]);
    } catch (err) {
      console.log("사용자후기 로딩 실패");
    }
  };
  useEffect(() => {
    getReviewFn();
  }, [id, url]);

  //후기 한줄만 보이기, 클릭시 전체내용 보이기
  const toggleReview = (reviewId) => {
    setUserReview((prev) =>
      prev.map((el) =>
        el.id === reviewId ? { ...el, isOpen: !el.isOpen } : el,
      ),
    );
  };
  //후기 추천(좋아요)
  const [thumbsUp, setThumbsUp] = useState({});
  const handleLikeFn = async (el) => {
    if (isState) {
      alert("로그인 후 이용해 주세요");
      navigate(`/auth/login`);
      return;
    }
    const hasLiked = el.likedUsers?.includes(user.userEmail);
    const nextLike = hasLiked ? (el.like || 0) - 1 : (el.like || 0) + 1; //이미 좋아요 상태이면 감소, 아니면 증가
    const updateLikedUsers = hasLiked
      ? el.likedUsers.filter((email) => email !== user.userEmail) //좋아요 취소 시 사용자 이메일 제거
      : [...(el.likedUsers || []), user.userEmail]; //좋아요 시 사용자 이메일 추가
    //UI 반영
    setThumbsUp((prev) => ({ ...prev, [el.id]: !hasLiked }));
    setUserReview((prev) =>
      prev.map((review) =>
        review.id === el.id
          ? { ...review, like: nextLike, likedUsers: updateLikedUsers }
          : review,
      ),
    );
    //db에 반영
    try {
      const res = await axios.patch(`${url}/productReview/${el.id}`, {
        like: nextLike,
        likedUsers: updateLikedUsers,
      });
    } catch (err) {
      setThumbsUp((prev) => ({ ...prev, [el.id]: hasLiked }));
      setLike((prev) => ({
        ...prev.map((review) =>
          review.id === el.id
            ? { ...review, like: el.like, likedUsers: el.likedUsers }
            : review,
        ),
      }));
      console.log("좋아요 업데이트 실패");
    }
  };

  const [reviewAddModal, setReviewAddModal] = useState(false);

  //내가 작성한 후기 수정하기
  const [editId, setEditId] = useState(null);
  const [score, setScore] = useState(userReview.score);
  const [text, setText] = useState(userReview.description);
  const updateFn = (el) => {
    setEditId(el.id);
    setScore(el.score);
    setText(el.description);
  };
  const handleUpdateFn = async () => {
    if (text.length === 0) {
      alert("내용을 작성해 주세요");
      return;
    }
    try {
      const res = await axios.patch(`${url}/productReview/${editId}`, {
        score: score,
        description: text,
      });
      alert("후기를 수정했습니다");
      setEditId(null);
      getReviewFn(); //수정 후 최신 후기 불러오기
    } catch (err) {
      console.log("후기 수정 실패");
    }
  };
  //내가 작성한 후기 삭제하기
  const deleteFn = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }
    try {
      const res = await axios.delete(`${url}/productReview/${reviewId}`);
      alert("후기가 삭제되었습니다");
      getReviewFn();
    } catch (err) {
      console.log("후기 삭제 실패");
    }
  };

  return (
    <>
      <div className="detail-review">
        <div className="detail-review-con">
          {/* 후기 현황 요약 보이기 */}
          <div className="current-status">
            <div className="totalscore">
              <p className="avrscore">
                <img src="/images/star_filled.svg" /> {averageScore}점
              </p>
              <p className="totalno">후기 {userReview.length}건</p>
            </div>
          </div>
          {/* 후기 리스트 */}
          <div className="reviews">
            {!isState &&
            !userReview.some((r) => r.userEmail === user.userEmail) &&
            hasPurchased ? (
              <button onClick={() => setReviewAddModal(true)}>
                후기 작성하기
              </button>
            ) : (
              <></>
            )}
            {reviewAddModal && (
              <ProdDetailReviewModal
                setReviewAddModal={setReviewAddModal}
                productId={id}
                user={user}
                onSuccess={() => {
                  alert("후기가 등록되었습니다");
                  getReviewFn();
                }}
              />
            )}
            <ul>
              {userReview &&
                userReview
                  .filter((el) => el.userEmail === user?.userEmail)
                  .map((el) => (
                    <li key={el.id}>
                      <div className="myreview">
                        <h1>[내가 작성한 후기]</h1>
                        {editId === el.id ? (
                          <>
                            <li className="score-selector">
                              <label htmlFor="score">점수:</label>
                              <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <label key={num} className="star-label">
                                    <input
                                      type="radio"
                                      name="score"
                                      id="score"
                                      value={num}
                                      checked={score === num}
                                      onChange={(e) =>
                                        setScore(Number(e.target.value))
                                      }
                                    />
                                    <img
                                      src={
                                        num <= score
                                          ? "/images/star_filled.svg"
                                          : "/images/star_empty.svg"
                                      }
                                      alt="star"
                                      className="star-img"
                                    />
                                  </label>
                                ))}
                              </div>
                            </li>
                            <li>
                              <label htmlFor="textarea">상세후기:</label>
                              <textarea
                                className="review-textarea"
                                name="review-text"
                                id="review-text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                maxLength="500"
                              />
                              <p>{text.length}/500자</p>
                            </li>
                            <div className="editBtn">
                              <button onClick={() => handleUpdateFn()}>
                                수정 완료
                              </button>
                              <button onClick={() => setEditId(null)}>
                                수정 취소
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="star-rating">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <label key={num} className="star-label">
                                  <img
                                    src={
                                      num <= el.score
                                        ? "/images/star_filled.svg"
                                        : "/images/star_empty.svg"
                                    }
                                    alt="star"
                                    className="star-img"
                                  />
                                </label>
                              ))}
                              <p>
                                작성일자:{" "}
                                {new Date(el.date).toLocaleDateString()}
                              </p>
                            </div>
                            <p>{el.description}</p>
                            <p>추천: {el.like}회</p>
                            <div className="editBtn">
                              <button onClick={() => updateFn(el)}>
                                수정하기
                              </button>
                              <button onClick={() => deleteFn(el.id)}>
                                삭제하기
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
            </ul>
            <ul>
              {userReview &&
                userReview.map((el, idx) => {
                  return (
                    <li
                      key={el.id}
                      onClick={() => {
                        toggleReview(el.id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <p>작성자: {el.userName}</p>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <label key={num} className="star-label">
                            <img
                              src={
                                num <= el.score
                                  ? "/images/star_filled.svg"
                                  : "/images/star_empty.svg"
                              }
                              alt="star"
                              className="star-img"
                            />
                          </label>
                        ))}
                        <p>
                          작성일자: {new Date(el.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: el.isOpen ? "normal" : "nowrap",
                        }}
                      >
                        {el.description}
                      </p>
                      {el.description &&
                        el.description.length > 20 && ( //<==화면에 보여지는 넓이에 따라 값 조정
                          <small style={{ color: "gray" }}>
                            {el.isOpen ? "[접기]" : "...더보기"}
                          </small>
                        )}
                      <button
                        className="likeBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeFn(el);
                        }}
                        style={{ cursor: "pointer", width: "30px" }}
                      >
                        <img
                          src={
                            el.likedUsers?.includes(user?.userEmail)
                              ? `/images/icon_like_on.svg`
                              : `/images/icon_like_off.svg`
                          }
                          alt="icon_like"
                        />
                        {el.like ?? 0}
                      </button>
                    </li>
                  );
                })}
              {userReview.length === 0 && <p>등록된 후기가 없습니다.</p>}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProdDetailReview;
