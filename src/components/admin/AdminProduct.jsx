import React, { use, useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminProductModal from "./AdminProductModal";

const categoryMap = {
  hydro: "보습",
  trouble: "트러블케어",
  white: "미백",
  antiage: "안티에이징",
  uv: "UV",
};

const AdminProduct = () => {
  const [productList, setProductList] = useState([]);
  const productUrl = API_JSON_SERVER_URL;
  const [adminAddModal, setAdminAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [sortType, setSortType] = useState("regDateDesc");
  const [page, setPage] = useState(1);
  const productListFn = async (e) => {
    try {
      const res = await axios.get(`${productUrl}/product`);
      setProductList(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    productListFn();
  }, [productUrl]);

  //상품후기 불러오기
  const [productReview, setProductReview] = useState([]);
  useEffect(() => {
    const productReviewFn = async () => {
      try {
        const res = await axios.get(`${productUrl}/productReview`);
        // console.log(res.data);
        setProductReview(Array.isArray(res.data) ? res.data : [res.data]);
      } catch (err) {
        console.log("상품후기 로딩 실패");
      }
    };
    productReviewFn();
  }, [productUrl]);
  //상품후기 평점 계산
  const reviewStatus = (productId) => {
    const reviews = productReview.filter(
      (review) => review.productId === productId,
    );
    const revCount = reviews.length;
    const avrScore =
      revCount > 0
        ? (
            reviews.reduce((acc, cur) => acc + (Number(cur.score) || 0), 0) /
            revCount
          ).toFixed(1)
        : 0.0;
    return { revCount, avrScore: Number(avrScore) };
  };

  const filtered = useMemo(() => {
    //검색 및 카테고리 필터링
    const q = searchText.trim().toLowerCase();
    const filteredList = productList.filter((m) => {
      if (categoryFilter !== "ALL" && m.category !== categoryFilter)
        return false;
      if (!q) return true;

      const searchTarget = [m.category, m.name, m.price, m.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchTarget.includes(q);
    });

    //정렬
    return filteredList.sort((a, b) => {
      const parseRegDate = (str) => (str ? new Date(str).getTime() : 0);

      switch (sortType) {
        case "regDateAsc":
          return parseRegDate(a.regDate) - parseRegDate(b.regDate);
        case "regDateDesc":
          return parseRegDate(b.regDate) - parseRegDate(a.regDate);
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "avrScoreAsc":
          return reviewStatus(a.id).avrScore - reviewStatus(b.id).avrScore;
        case "avrScoreDesc":
          return reviewStatus(b.id).avrScore - reviewStatus(a.id).avrScore;
        case "revCountAsc":
          return reviewStatus(a.id).revCount - reviewStatus(b.id).revCount;
        case "revCountDesc":
          return reviewStatus(b.id).revCount - reviewStatus(a.id).revCount;
      }
    });
  }, [productList, searchText, categoryFilter, sortType, productReview]);

  //리스트 항목 선택/해제
  const [checkedItems, setCheckedItems] = useState([]);
  const handleSingleCheck = (checked, id) => {
    if (checked) {
      setCheckedItems((prev) => [...prev, id]);
    } else {
      setCheckedItems(checkedItems.filter((el) => el !== id));
    }
  };
  const handleAllCheck = (checked) => {
    if (checked) {
      const idArray = productList.map((el) => el.id);
      setCheckedItems(idArray);
    } else {
      setCheckedItems([]);
    }
  };
  //선택상품 삭제
  const onDeleteFn = async () => {
    if (checkedItems.length === 0) return alert("삭제할 항목을 선택해 주세요");

    if (
      !window.confirm(
        `선택한 ${checkedItems.length}개의 상품을 삭제 하시겠습니까?`,
      )
    )
      return;

    try {
      const res = checkedItems.map((id) =>
        axios.delete(`${productUrl}/product/${id}`),
      );
      await Promise.all(res);
      setCheckedItems([]);
      productListFn();
      alert(`삭제 되었습니다`);
    } catch (err) {
      alert(err);
    }
  };

  const adminModalFn = (id) => {
    setSelectedId(id);
    setAdminAddModal(true);
  };

  const totalPost = filtered.length;
  const pageRange = 10;
  const btnRange = 10;
  const totalPages = Math.max(1, Math.ceil(totalPost / pageRange));

  const lastPage = Math.ceil(totalPost / pageRange);
  const totalSet = Math.ceil(totalPages / btnRange);
  const currentSet = Math.ceil(page / btnRange);

  const startPage = (currentSet - 1) * btnRange + 1;
  const endPage = startPage + btnRange - 1;

  const startPost = (page - 1) * pageRange;
  const endPost = startPost + pageRange;

  const pagedList = useMemo(() => {
    return filtered.slice(startPost, endPost);
  }, [filtered, startPost, endPost]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);
  useEffect(() => {
    setPage(1);
  }, [searchText, categoryFilter]);

  return (
    <>
      {adminAddModal && (
        <AdminProductModal
          setAdminAddModal={setAdminAddModal}
          productId={selectedId}
          onSuccess={() => productListFn()}
        />
      )}
      <div className="admin">
        <div className="admin-title">
          <div className="admin-toolbar">
            <div className="admin-toolbar-searchtext">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="검색어 입력"
              />
            </div>
            <div className="admin-toolbar-selector">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="regDateDesc">등록순 (최신순)</option>
                <option value="regDateAsc">등록순 (과거순)</option>
                <option value="priceDesc">가격순 (높은순)</option>
                <option value="priceAsc">가격순 (낮은순)</option>
                <option value="avrScoreDesc">평점순 (높은순)</option>
                <option value="avrScoreAsc">평점순 (낮은순)</option>
                <option value="revCountDesc">후기순 (많은순)</option>
                <option value="revCountAsc">후기순 (적은순)</option>
              </select>
            </div>
          </div>
          <ul>
            <li>
              <div className="admin-selector">
                <ul>
                  <li>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="ALL">전체</option>
                      <option value="hydro">보습</option>
                      <option value="trouble">트러블케어</option>
                      <option value="white">미백</option>
                      <option value="antiage">안티에이징</option>
                      <option value="uv">UV</option>
                    </select>
                  </li>
                </ul>
              </div>
              <div className="admin-button">
                <button onClick={() => adminModalFn(null)}>상품추가</button>
                <button onClick={() => onDeleteFn()}>선택삭제</button>
              </div>
            </li>
          </ul>
        </div>
        <div className="admin-con">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    name="checkAll"
                    id="checkAll"
                    onChange={(e) => handleAllCheck(e.target.checked)}
                    checked={checkedItems.length === productList.length}
                  />
                </th>
                <th>상품이미지</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>평점/후기건수</th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((el) => {
                const { revCount, avrScore } = reviewStatus(el.id);
                return (
                  <tr
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      adminModalFn(el.id);
                    }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        name="checkSingle"
                        id="checkSingle"
                        onChange={(e) => {
                          handleSingleCheck(e.target.checked, el.id);
                        }}
                        checked={checkedItems.includes(el.id)}
                      />
                    </td>
                    <td>
                      <img
                        src={`/images/${el.category}/${el.img}`}
                        alt={el.img}
                        onError={(e) =>
                          (e.currentTarget.src = `/images/all_none.png`)
                        }
                      />
                    </td>
                    <td>{el.name}</td>
                    <td>{categoryMap[el.category] || el.category}</td>
                    {/* <td>{el.price.toLocaleString()}원</td> */}
                    <td>{Number(el.price).toLocaleString()}원</td>
                    <td>
                      {avrScore}점/{revCount}건
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="admin-footer">
          <div className="admin-paging">
            <button onClick={() => setPage(1)} disabled={page === 1}>
              ◀◀
            </button>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              ◀
            </button>

            {Array.from({ length: btnRange }, (_, i) => {
              const pageNum = startPage + i;
              if (pageNum > lastPage) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setPage(pageNum);
                  }}
                  className={page === pageNum ? "active" : ""}
                  disabled={page === pageNum}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => {
                setPage(page + 1);
              }}
              disabled={page === lastPage}
            >
              ▶
            </button>
            <button
              onClick={() => {
                setPage(lastPage);
              }}
              disabled={page === lastPage}
            >
              ▶▶
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProduct;
