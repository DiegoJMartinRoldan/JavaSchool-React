import React, { useEffect, useState } from 'react'
import useCustomAxios from '../authentication/customHooks/useCustomAxios'
import useAuth from '../authentication/customHooks/useAuth';
import Context from '../authentication/customHooks/Auth';





function OrderHistoryEmployees() {

  const [orders, setOrders] = useState([])
  const customAxios = useCustomAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const { auth } = useAuth(Context);

  useEffect(() => {
    const endpoint = '/orders/list';

    customAxios
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        const ordersData = response.data;
        setOrders(ordersData);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, [auth.accessToken]);


  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  //Change Order Status
  const handleStatusChange = (orderId, newStatus) => {
    const changeStatusEndpoint = `/orders/update/status/${orderId}`;

    customAxios
      .put(changeStatusEndpoint, { orderStatus: newStatus }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        const updatedOrders = orders.map((order) => {
          if (order.id === orderId) {
            return { ...order, orderStatus: newStatus };
          }
          return order;
        });

        setOrders(updatedOrders);
      })
      .catch((error) => {
        console.error('Error updating order status:', error);
      });
  };

  return (
    <div>
      <h1>Order History</h1>

      <table>
        <thead>
          <tr>
            <th>Payment Method</th>
            <th>Delivery Method</th>
            <th>Payment Status</th>
            <th>Order Status</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((orders) => (
            <tr key={orders.id}>
              <td>{orders.paymentMethod}</td>
              <td>{orders.deliveryMethod}</td>
              <td>{orders.paymentStatus}</td>
              <td>{orders.orderStatus}</td>
              <td>{orders.orderDate}</td>

              <td>-- Change order Status: </td>
              <select
                value={orders.orderStatus}
                onChange={(e) => handleStatusChange(orders.id, e.target.value)}>
                <option value="pending">Pending</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );

}

export default OrderHistoryEmployees