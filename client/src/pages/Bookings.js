import React, { useContext } from 'react'
import BookingList from '../components/Bookings/BookingList/BookingList';

import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';


const Bookings = () => {
    const { token, userId } = useContext(AuthContext);
    const [bookings, setBookings] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [outputType, setOutputType] = React.useState('list')


    const fetchBookings = () => {
        setIsLoading(true)
        const requestBody = {
          query: `
              query {
                bookings {
                  _id
                 createdAt
                 event {
                   _id
                   title
                   date
                   price
                 }
                }
              }
            `
        };
    
        fetch('http://localhost:4000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        })
          .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then(resData => {
            const bookings = resData.data.bookings;
            setIsLoading(false)
            setBookings(bookings)
          })
          .catch(err => {
            console.log(err);
            setIsLoading(false)
          });
      };


      React.useEffect(() => {
        fetchBookings();
      }, []);

    const deleteBookingHandler = bookingId => {
        setIsLoading(true);
    const requestBody = {
      query: `
          mutation CancelBooking($id: ID!) {
            cancelBooking(bookingId: $id) {
            _id
             title
            }
          }
        `,
      variables: {
        id: bookingId
      }
    };

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        setBookings(prevState => {
          const updatedBookings = bookings.filter(booking => {
            return booking._id !== bookingId;
          });
          return updatedBookings;
        });
        setIsLoading(false)
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false)
      });
      }
    
    const   changeOutputTypeHandler = outputType => {
      if (outputType === 'list') {
        setOutputType('list')
      } else {
        setOutputType('chart')
      }
    };

    return (
        <React.Fragment>
        {isLoading ? (
          <Spinner />
        ) : (
          <React.Fragment>
              <BookingsControls
                activeOutputType={outputType}
                onChange={changeOutputTypeHandler}
              />
              <div>
                {outputType === 'list' ? (
                  <BookingList
                    bookings={bookings}
                    onDelete={deleteBookingHandler}
                  />
                ) : (
                  <BookingsChart bookings={bookings} />
                )}
              </div>
            </React.Fragment>
        
        )}
      </React.Fragment>
    )
}

export default Bookings
