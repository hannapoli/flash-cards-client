import { Link } from 'react-router';
import './InfoList.scss';

export const InfoList = ({
    itemObject,
    stateObject,
    onModifyPath,
    onDelete

}) => {
    return (
        <>
            <article className='flexColumn centeredContent itemInfo'>
                <h3>{itemObject.name}</h3>
                <p><span className='bold'>UID:</span> {itemObject.firebase_uid}</p>
                <p><span className='bold'>Email:</span> {itemObject.email}</p>
                <p><span className='bold'>Role:</span> {itemObject.role}</p>
                <div className='infoActions flexContainer'>
                    <Link
                        to={onModifyPath}
                        state={stateObject}>
                        <button>Modificar</button>
                    </Link>
                    <button onClick={() => onDelete(itemObject)} className='deleteBtn'>
                        Eliminar
                    </button>
                </div>
            </article >
        </>
    )
}
