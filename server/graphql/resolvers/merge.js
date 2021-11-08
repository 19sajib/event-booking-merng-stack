const Event = require('../../models/event')
const User = require('../../models/user')


const transformEvent = event => {
    return {
        ...event._doc,
        creator: user.bind(this, event.creator),
    }
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event)
    }
};

const events = async eventIds => {
    try {
    const events = await Event.find({_id: {$in: eventIds} })
    return events.map(event => {
                return transformEvent(event)
              })
    } catch(err) {
              throw err;
          }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event)
    } catch (error) {
        throw error;
    }
}

const user = async userId => {
    try {
    const user = await User.findById(userId)
        return {
                ...user._doc,
                createdEvents: events.bind(this, user._doc.createdEvents)
                }

        } catch(err) {
                throw err;
            }
}

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
//exports.user = user;
//exports.events = events;
exports.singleEvent = singleEvent;