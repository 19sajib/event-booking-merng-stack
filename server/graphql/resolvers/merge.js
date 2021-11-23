const DataLoader = require('dataloader')

const Event = require('../../models/event')
const User = require('../../models/user')

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds); 
})
const userLoader = new DataLoader((userIds) => {
    return User.find({_id: {$in: userIds}})
})

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
    events.sort((a,b) => {
        return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
    })
    return events.map(event => {
                return transformEvent(event)
              })
    } catch(err) {
              throw err;
          }
}

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event
    } catch (error) {
        throw error;
    }
}

const user = async userId => {
    try {
    const user = await userLoader.load(userId.toString())
        return {
                ...user._doc,
                createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
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
