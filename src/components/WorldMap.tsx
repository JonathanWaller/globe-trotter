import { useState, useEffect } from 'react'
import { geoPath, geoOrthographic } from 'd3-geo'
import { feature } from 'topojson-client'
import { Feature, FeatureCollection, Geometry } from 'geojson';

import { CoordinatesType } from './types/map';

import axios from 'axios';

import AnimationFrames from '../hooks/AnimationFrames'
// import './WorldMap.scss'

const uuid = require('react-uuid')

const scale: number = 200
const cx: number = 400
const cy: number = 150

const WorldMap = () => {
    const [geographies, setGeographies] = useState<[] | Array<Feature<Geometry | null>>>([]);
    const [isRotate, setIsRotate] = useState<boolean>(true);
    const [rotation, setRotation] = useState<number>(0);

    const [locationState, setLocationState ]= useState<{name: string, lat: string, lng: string}>({
      name: '',
      lat: '',
      lng: ''
    })

    const [ displayCoordinates, setDisplayCoordinates ] = useState<CoordinatesType[]>([])

    const {name, lat, lng} = locationState;

    const fetchCoordinates = async () => {

      try {
        const response: any = await axios.get('/api/getCoordinateData');

        if( response.status === 200 ) {
          setDisplayCoordinates(response.data)
        } else {
          // Todo: error handling
        }

      } catch ( e:any ) {
        console.log(`Error - ${e.message}`)
        // Todo: error handling
      }
    }

    useEffect( () => {
      fetchCoordinates()
    }, [])

    useEffect( () => {
        fetch('/data/globeData.json').then((response) => {
            if (response.status !== 200) {
              console.log(`Houston we have a problem: ${response.status}`)
              return
            }
            response.json().then((worldData) => {
                const mapFeatures: Array<Feature<Geometry | null>> = ((feature(worldData, worldData.objects.countries) as unknown) as FeatureCollection).features
        setGeographies(mapFeatures)
      })
    })
    }, [])

    const handleInputChange = ( e: any ) => {
      const { name, value } = e.target;

      setLocationState({
        ...locationState,
        [name]: value
      })
    }

    const handleAddLocation = async() => {
      if( !name || !lat || !lng ) return;

      const coordinateObj = {name, coordinates: [Number(lat), Number(lng)]}

      try {
        const response: any = await axios.post('/api/addCoordinates', coordinateObj);
        console.log('Add RESPONSE: ', response)

        if( response.status === 200 ) {
          setDisplayCoordinates(response.data)
          setLocationState({name: '', lat: '', lng: ''})
        } else {
          // Todo: error handling
        }

      } catch ( e:any ) {
        console.log(`Error - ${e.message}`)
        // Todo: error handling
      }
    }

    const returnProjectionValueWhenValid = (point: [number, number], index: number) => {
      const retVal: [number, number] | null = projection(point)
      if (retVal?.length) {
        return retVal[index]
      }
      return 0
    }

    const handleMarkerClick = (i: number) => {
      // alert(`Marker: ${  JSON.stringify( data[i])}` )
    }

    const projection = geoOrthographic()
        .scale(scale)
        .translate([cx, cy])
        .rotate([rotation, 0])

    AnimationFrames(() => {
        if (isRotate) {
          let newRotation = rotation;
          if (rotation >= 360) {
            newRotation = rotation - 360;
          }
          setRotation(newRotation + 0.2);
        }
      });

    return (
        <>
          {/* <button
              onClick={() => {
                  setIsRotate(true)
                }}
          >
              Click
          </button> */}
          <g>
              <circle
              fill="lightgrey"
              cx={cx}
              cy={cy}
              r={scale}
              />
          </g>
          <svg width={scale * 3} height={scale * 3} viewBox="0 0 800 450">
            
            <g>
              {(geographies as []).map((d, i) => (
                <path
                  key={`path-${uuid()}`}
                  d={geoPath().projection(projection)(d) as string}
                  fill={`rgba(38,50,56,${(1 / (geographies ? geographies.length : 0)) * i})`}
                  stroke="aliceblue"
                  strokeWidth={0.5}
                />
              ))}
            </g>

            <g>
            {displayCoordinates?.length && displayCoordinates.map((d: CoordinatesType, i: number) => (
              <circle
                key={`marker-${uuid()}`}
                cx={returnProjectionValueWhenValid(d.coordinates, 0)}
                cy={returnProjectionValueWhenValid(d.coordinates, 1)}
                r={5}
                fill="#E91E63"
                stroke="#FFFFFF"
                onClick={() => handleMarkerClick(i)}
                onMouseEnter={() => setIsRotate(false)}
              />
            ))}
            </g>


          </svg>

          <div>
            <input
              name="name"
              onChange={handleInputChange}
              placeholder="name"
            />
            <input 
              name="lat"
              onChange={handleInputChange}
              placeholder="lat"
            />
            <input
              name="lng"
              onChange={handleInputChange}
              placeholder="lng"
            />

            <button
              onClick={handleAddLocation}
            >Add Location</button>

          </div>
        </>
      )

}

export default WorldMap;