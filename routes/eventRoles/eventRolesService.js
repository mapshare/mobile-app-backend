const mongoose = require("mongoose");
const EventRoles = require('../../models/eventRoles');

module.exports = () => {
    return {
        getEventRoles: () => {
            return new Promise((resolve, reject) => {
                EventRoles.find()
                    .then(data => resolve(data))
                    .catch(err => reject(err));
            });
        },

        addEventRoles: (userData) => {
            return new Promise((resolve, reject) => {
                EventRoles.create({ ...userData })
                    .then(data => {
                        resolve(data)
                    })
                    .catch(err => reject(err));
            })
        },

        getEventRolesById: (EventRoleId) => {
            return new Promise((resolve, reject) => {
                EventRoles.findById(EventRoleId)
                    .populate('eventRole')
                    .then(data => {
                        if (data) resolve(data)
                        else reject('no Group Role with specified id')
                    })
                    .catch(err => reject(err));
            });
        },

        updateEventRolesById: (EventRoleId, newData) => {
            return new Promise((resolve, reject) => {
                let { eventRoleName,
                    eventRolePermisionLevel } = newData;

                EventRoles.findById(EventRoleId)
                    .then(eventRole => {
                        if (!eventRole) {
                            reject("Group Roles doesn't exist");
                            return;
                        }

                        eventRole.eventRoleName = eventRoleName ? eventRoleName : eventRole.eventRoleName;
                        eventRole.eventRolePermisionLevel = eventRolePermisionLevel ? eventRolePermisionLevel : eventRole.eventRolePermisionLevel;

                        eventRole.save()
                            .then(data => { resolve({ "success": data }) })
                            .catch(err => reject(err))
                    }).catch(err => reject(err));
            });
        },
        deleteEventRolesById: (EventRoleId) => {
            return new Promise((resolve, reject) => {
                EventRoles.findById(EventRoleId)
                    .then(eventRole => {
                        if (!eventRole) {
                            reject("EventRoles doesn't exist");
                            return;
                        }
                        eventRole.remove()
                            .then(data => resolve(data))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            });
        }
    }
}