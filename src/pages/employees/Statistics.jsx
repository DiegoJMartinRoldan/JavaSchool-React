import React from 'react'
import { useState, useEffect } from 'react'
import useCustomAxios from '../authentication/customHooks/useCustomAxios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../authentication/customHooks/useAuth'
import Context from '../authentication/customHooks/Auth'
import { toast } from 'react-toastify';


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
      <div>
        {/*Clients List */}
        <h1>Clients</h1>
        <table>
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

        <div>
          {Array.from({ length: Math.ceil(client.length / clientsPerPage) }, (_, index) => (
            <button key={index} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>

        <p>----------</p>
        {/*Top 10 Clients */}

        <h1>Top 10 Clients</h1>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Date of Birth</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {topTenClients.map((topTenClients) => (
              <tr key={topTenClients.id}>
                <td>{topTenClients.name}</td>
                <td>{topTenClients.surname}</td>
                <td>{topTenClients.dateOfBirth}</td>
                <td>{topTenClients.email}</td>
              </tr>
            ))}

          </tbody>
        </table>

        <p>----------------</p>
        {/*Top 10 Products */}

        <h1>Top 10 Products</h1>

        <table>
          <thead>
            <tr>
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
            {topTenProducts.map((topTenProducts) => (
              <tr key={topTenProducts.id}>
                <td>{topTenProducts.title}</td>
                <td>{topTenProducts.price}</td>
                <td>{topTenProducts.category}</td>
                <td>{topTenProducts.parameters}</td>
                <td>{topTenProducts.weight}</td>
                <td>{topTenProducts.volume}</td>
                <td>{topTenProducts.quantityStock}</td>
              </tr>
            ))}

          </tbody>
        </table>
        <p>----------------</p>

        {/*Weekly Revenue */}

        <h1>Weekly Revenue</h1>
        <span>{weeklyRevenue !== undefined ? weeklyRevenue.toString() + '€' : 'No data available'}</span>

        <p>----------------</p>
        {/*Monthly Revenue */}

        <div className='container mt-5'>
          <h1>Monthly Revenue</h1>
          <form onSubmit={handleMonthlyRevenue} className='row g-3'>
            <div className='col-md-6'>
              <label className="form-label">Year:</label>
              <input
                type="text"
                className="form-control"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>

            <div className='col-md-6'>
              <label className="form-label">Month:</label>
              <input
                type="text"
                className="form-control"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">
              Submit
            </button>
          </form>
        </div>


        <h1>Monthly Revenue</h1>
        <span>{monthlyRevenue !== undefined ? monthlyRevenue.toString() + '€' : 'No data available'}</span>








      </div>
    )
  }


export default Statistics;