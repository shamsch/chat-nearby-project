const { getUsers } = require("../controller/controller");

const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
};

const getDistanceFromLatLon = (lat1, lon1, lat2, lon2) => {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var dInKM = R * c; // Distance in km
    return dInKM * 1000;
};

const findAvailableUser = async (user) => {
    const allActiveUser = await getUsers();

    const closeByUser = allActiveUser.filter((dbUser) => {
        const dist = getDistanceFromLatLon(
            parseInt(user.y),
            parseInt(user.x),
            parseInt(dbUser.y),
            parseInt(dbUser.x)
        );
        return dist<15 && dbUser.socketID != user.socketID;
    });

    return closeByUser; 
};

module.exports = { findAvailableUser };
