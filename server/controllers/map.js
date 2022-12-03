const coordinates = [
    { name: 'Brooklyn, NY', coordinates: [40.67781589193247, -73.99051937443319] },
    { name: 'Athens, Greece', coordinates: [37.97439446403982, 23.73078100616044] },
  ]


const getCoordinates = ( req, res) => {
    res.status(200).json(coordinates)
}

const addCoordinates = ( req, res ) => {
    coordinates.push(req.body);
    res.status(200).json(coordinates)
}


module.exports = {
    getCoordinates,
    addCoordinates
}