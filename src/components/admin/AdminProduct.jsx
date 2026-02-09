import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminProductModal from "./AdminProductModal";
const AdminProduct = () => {
  const [productList, setProductList] = useState([]);
  const productUrl = API_JSON_SERVER_URL;
  const [adminAddModal, setAdminAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return productList.filter((m) => {
      if (categoryFilter !== "ALL" && m.category !== categoryFilter)
        return false;
      if (!q) return true;

      const searchTarget = [m.category, m.name, m.price, m.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchTarget.includes(q);
    });
  }, [productList, searchText, categoryFilter]);

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

  const adminModalFn = (id) => {
    setSelectedId(id);
    setAdminAddModal(true);
  };

  return (
    <>
      {adminAddModal && (
        <AdminProductModal
          setAdminAddModal={setAdminAddModal}
          productId={selectedId}
        />
      )}
      <div className="adminProduct">
        <div className="adminProduct-con">
          <div className="title">
            <ul>
              <li>
                <div className="toolbar">
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="검색어 입력"
                  />
                </div>
              </li>
              <li>
                <div className="categorySelector">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="ALL">전체</option>
                    <option value="hydro">보습</option>
                    <option value="antiage">항산화</option>
                    <option value="trouble">트러블케어</option>
                    <option value="uv">자외선차단</option>
                    <option value="white">미백</option>
                  </select>
                </div>
              </li>
            </ul>
          </div>
          <table>
            <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>이미지링크</th>
                <th>예시이미지</th>
                <th>상세설명</th>
                <th>카테고리</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((el) => {
                return (
                  <tr key={el.id}>
                    <td>{el.name}</td>
                    <td>{el.price}</td>
                    <td>{el.img}</td>
                    <td>
                      <img src={`/images/${el.img}`} alt={el.name} />
                    </td>
                    <td>
                      {el.description && el.description.length > 10
                        ? `${el.description.slice(0, 10)}...`
                        : el.description}
                    </td>
                    <td>{el.category}</td>
                    <td
                      onClick={() => {
                        adminModalFn(el.id);
                      }}
                    >
                      보기
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="adminProductFooter">
            <div className="adminProductPaging">
              <button onClick={() => setPage(1)} disabled={page === 1}>
                ◀◀
              </button>
              <button
                onClick={() => setPage(startPage - 1)}
                disabled={currentSet === 1}
              >
                ◀
              </button>
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                이전
              </button>
              {Array.from({ length: btnRange }, (_, i) => {
                const pageNum = startPage + i;
                if (pageNum > lastPage) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={page === pageNum ? "active" : ""}
                    disabled={page === pageNum}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="next"
                onClick={() => setPage(page + 1)}
                disabled={page === lastPage}
              >
                다음
              </button>
              <button
                className="next-set"
                onClick={() => setPage(endPage + 1)}
                disabled={currentSet === totalSet}
              >
                ▶
              </button>
              <button
                className="last"
                onClick={() => setPage(lastPage)}
                disabled={page === lastPage}
              >
                ▶▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProduct;
