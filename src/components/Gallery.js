import { useContext } from 'react'
import { DataContext } from '../contexts/DataContext'
import GalleryItem from './GalleryItem'

const Gallery = () => {
    const data = useContext(DataContext)

    const display = data.map((item, index) => {
        return (
            <GalleryItem item={item} key={index} />
        )
    })
    return (
        <div>
            {display}
        </div>
    )
}

export default Gallery