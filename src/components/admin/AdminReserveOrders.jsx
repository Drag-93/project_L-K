import React, { useEffect, useState } from 'react';
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminReservationModal from './AdminReservationModal';

const AdminReserveOrders = () => {
  const url = API_JSON_SERVER_URL;
  const { id } = useParams();
  const [reserveOrderList, setReserveOrderList] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchReserveOrders = async () => {
      try {
        const res = await axios.get(`${url}/reserveOrders`);
        setReserveOrderList(res.data);
      } catch (err) {
        console.error(err);
        alert("데이터를 불러오는데 실패했습니다.");
      }
    };
    fetchReserveOrders();
  }, [url]);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="reserveorderlist">
        <div className="reserveorderlist-con">
          <table>
            <thead>
              <tr>
                <th>진료명</th>
                <th>고객명</th>
                <th>전화번호</th>
                <th>날짜</th>
                <th>시간</th>
                <th>요청사항</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {reserveOrderList.map((el) => {
                const items = el.items?.[0];
                return (
                  <tr key={el.id}>
                    <td>{items?.name}</td>
                    <td>{el.customer?.userName}</td>
                    <td>{el.customer?.phonenum}</td>
                    <td>{items?.date}</td>
                    <td>{items?.time}</td>
                    <td>{el.customer?.request}</td>
                    <td 
                      onClick={() => handleOpenModal(el)} 
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      보기
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <AdminReservationModal 
          id={selectedOrder.id} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default AdminReserveOrders;