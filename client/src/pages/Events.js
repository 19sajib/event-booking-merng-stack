import React, { useContext } from "react";

import AuthContext from "../context/auth-context";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Spinner from "../components/Spinner/Spinner";
import "./Events.css";

const Events = () => {
  const { token, userId } = useContext(AuthContext);
  const [events, setEvents] = React.useState([]);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const titleElRef = React.useRef();
  const priceElRef = React.useRef();
  const dateElRef = React.useRef();
  const descElRef = React.useRef();

  const startCreateEventHandler = () => {
    setCreating(true);
  };

  const modalConfirmHandler = () => {
    const title = titleElRef.current.value;
    const price = +priceElRef.current.value;
    const date = dateElRef.current.value;
    const description = descElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
                mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!) {
                  createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
                    _id
                    title
                    description
                    date
                    price
                  }
                }
              `,
              variables: {
                title: title,
                description: description,
                price: price,
                date: date
              }
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setEvents((prevState) => {
          const updatedEvents = [...prevState];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: userId,
            },
          });
          return updatedEvents;
        });
      })
      .catch((err) => {
        console.log(err);
      });

    setCreating(false);
  };

  const modalCancelHandler = () => {
    setCreating(false);
    setSelectedEvent(null)
  };

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: `
              query {
                events {
                  _id
                  title
                  description
                  date
                  price
                  creator {
                    _id
                    email
                  }
                }
              }
            `,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        setEvents(events);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const showDetailHandler = (eventId) => {
    setSelectedEvent((prevState) => {
      const selectedEvent = events.find((e) => e._id === eventId);
      return selectedEvent;
    });
  };

  const bookEventHandler = () => {
    if(!token) {
      setSelectedEvent(null);
      return;
    }
    const requestBody = {
      query: `
              mutation BookEvent($id: ID!){
                bookEvent(eventId: $id) {
                  _id
                  createdAt
                  updatedAt
                }
              }
            `,
            variables: {
              id: selectedEvent._id
            }
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setSelectedEvent(null)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      {creating && <Backdrop />}
      {creating && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form>
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" ref={titleElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" ref={priceElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="date">Date</label>
              <input type="datetime-local" id="date" ref={dateElRef}></input>
            </div>
            <div className="form-control">
              <label htmlFor="description">Description</label>
              <textarea rows="4" id="description" ref={descElRef}></textarea>
            </div>
          </form>
        </Modal>
      )}
      {selectedEvent && (
          <Modal
            title={selectedEvent.title}
            canCancel
            canConfirm
            onCancel={modalCancelHandler}
            onConfirm={bookEventHandler}
            confirmText={token ? 'Book' : 'Confirm'}
          >
            <h1>{selectedEvent.title}</h1>
            <h2>
              ${selectedEvent.price} -{' '}
              {new Date(parseInt(selectedEvent.date)).toGMTString()}
            </h2>
            <p>{selectedEvent.description}</p>
          </Modal>
        )}
      {token && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={startCreateEventHandler}>
            Create Event
          </button>
        </div>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        <EventList
          events={events}
          userId={userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Events;
