import React from 'react'
import { useState, useEffect } from 'react'
import useCustomAxios from '../authentication/customHooks/useCustomAxios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../authentication/customHooks/useAuth'
import Context from '../authentication/customHooks/Auth'
import { toast } from 'react-toastify';
import './Statistics.css'


function Statistics() {
  const customAxios = useCustomAxios();
  const { auth } = useAuth(Context);

  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(5);

  const [client, setClient] = useState([]);
  const [topTenClients, setTopTenClients] = useState([]);
  const [topTenProducts, setTopTenProducts] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState();

  const [monthlyRevenue, setMonthlyRevenue] = useState();
  const [year, setYear] = useState();
  const [month, setMonth] = useState();



  //List (Client)
  useEffect(() => {
    const listClientEndpoint = '/client/list';

    customAxios
      .get(listClientEndpoint, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {

        const clientData = response.data;
        setClient(clientData);
        //console.log(clientData)
      })
      .catch((error) => {
        console.error('Error listing clients:', error);
      })
  }, [auth.accessToken]);


  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClient = client.slice(indexOfFirstClient, indexOfLastClient);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  //Top 10 Clients
  useEffect(() => {
    const topTenClientsEndpoint = '/statistics/topClients'

    customAxios
      .get(topTenClientsEndpoint, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        }
      })
      .then((response) => {
        const topTenClientsResponse = response.data;
        setTopTenClients(topTenClientsResponse);
        console.log('Top 10 clients', topTenClientsResponse)
      })
      .catch((error) => {
        console.error('Error getting top clients:', error);

      })
  }, [auth.accessToken])


  //Top 10 Products
  useEffect(() => {
    const topTenProductsEndpoint = '/statistics/topProducts'

    customAxios
      .get(topTenProductsEndpoint, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        }
      })
      .then((response) => {
        const topTenProductsResponse = response.data;
        setTopTenProducts(topTenProductsResponse);
        console.log('Top 10 Products', topTenProductsResponse);
      })
      .catch((error) => {
        console.error('Error getting top 10 products', error);
      })
  }, [auth.accessToken])


  //Weekly Revenue
  useEffect(() => {
    const weeklyRevenueEndpoint = '/statistics/weekly';

    customAxios
      .get(weeklyRevenueEndpoint, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        }
      })
      .then((response) => {
        console.log('Full Response', response);
        const weeklyRevenueResult = response.data;
        setWeeklyRevenue(weeklyRevenueResult);
        console.log('Weekly Revenue', weeklyRevenueResult);
      })
      .catch((error) => {
        console.error('Error getting weekly revenue', error);
      })
  }, [auth.accessToken]);

  //Monthly Revenue
  const isValidate = () => {
    let isAdded = true;
    let errorMessage = 'Please enter the correct value in: ';

    if (!year) {
      isAdded = false;
      errorMessage += 'Year ';
    }

    if (!month) {
      isAdded = false;
      errorMessage += 'Month';
    }
    if (!isAdded) {
      toast.warning(errorMessage);
    }

    return isAdded;
  };


  const handleMonthlyRevenue = (event) => {
    event.preventDefault();

    const monthlyRevenueEndpoint = '/statistics/monthly';

    const monthlyRevenueData = {
      year: year,
      month: month,
    };

    if (isValidate()) {
      customAxios
        .post(monthlyRevenueEndpoint, monthlyRevenueData, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          const monthlyRevenueResult = response.data;
          setMonthlyRevenue(monthlyRevenueResult);
          console.log('Monthly Revenue', monthlyRevenueResult);
        })
        .catch((error) => {
          toast.error('Try again.');
          console.error('Error', error);
        });
    }
  };

  return (
    <div className="statistics-clients-container">
      {/* Clients List */}
      <h3 className='clients-statistics'>Clients</h3>
      <table className="statistics-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Date of Birth</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {currentClient.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.surname}</td>
              <td>{client.dateOfBirth}</td>
              <td>{client.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="statistics-pagination">
        {Array.from({ length: Math.ceil(client.length / clientsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      {/* Top 10 Clients */}
      <h3 className='top-clients-statistics'>Top 10 Clients</h3>
      <table className="statistics-table">
        <thead>
          <tr>
            <th>Top 10 </th>
            <th>Name</th>
            <th>Surname</th>
            <th>Date of Birth</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {topTenClients.map((topTenClient, index) => (
            <tr key={topTenClient.id}>
              <td>{index + 1}</td>
              <td>{topTenClient.name}</td>
              <td>{topTenClient.surname}</td>
              <td>{topTenClient.dateOfBirth}</td>
              <td>{topTenClient.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Top 10 Products */}
      <h3 className='top-products-statistics'>Top 10 Products</h3>
      <table className="statistics-table">
        <thead>
          <tr>
            <th>Top 10 </th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Parameters</th>
            <th>Weight</th>
            <th>Volume</th>
            <th>Quantity Stock</th>
          </tr>
        </thead>
        <tbody>
          {topTenProducts.map((topTenProduct, index) => (
            <tr key={topTenProduct.id}>
              <td>{index + 1}</td>
              <td>{topTenProduct.title}</td>
              <td>{topTenProduct.price}</td>
              <td>{topTenProduct.category}</td>
              <td>{topTenProduct.parameters}</td>
              <td>{topTenProduct.weight}</td>
              <td>{topTenProduct.volume}</td>
              <td>{topTenProduct.quantityStock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Weekly Revenue */}
      <div className='weekly-statistics'>
        <h3 className='weekly-title' >Weekly Revenue</h3>
        <span>{weeklyRevenue !== undefined ? `${weeklyRevenue.toString()}€` : 'No data available'}</span>
      </div>


      {/* Monthly Revenue */}
      <div className="statistics-monthly-revenue">

        <form onSubmit={handleMonthlyRevenue} className="row g-3">
          <h4 className='monthly-statistics'>Monthly Revenue</h4>
          <div className=" monthly-form col-md-6">
            <label className="form-label">Year:</label>
            <input
              type="text"
              className="form-control"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Month:</label>
            <input
              type="text"
              className="form-control"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>
          <button type="submit" className="statistics-statistics-btn btn">
            Submit
          </button>
          <h4 className='monthly-statistics'>Monthly Revenue Result:</h4>
        <span className='monthly-response'>{monthlyRevenue !== undefined ? `${monthlyRevenue.toString()}€` : 'No data available'}</span>
        </form>
        
        
      </div>
    </div>
  );




}


export default Statistics;