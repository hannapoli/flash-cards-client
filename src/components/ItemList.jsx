import { Link } from 'react-router';

export const ItemList = ({
    itemObject,
    itemName,
    stateObject,
    onMainPath,
    onModifyPath,
    onDelete

}) => {
    return (
        <>
            <article className='item'>
                <Link
                    to={onMainPath}
                    state={stateObject}
                >
                    <button className='itemBtn'>{itemName}</button>
                </Link>
                <div className='itemActions'>
                    <Link
                        to={onModifyPath}
                        state={stateObject}>
                        <button>Modificar</button>
                    </Link>
                    <button onClick={() => onDelete(itemObject)} className='deleteBtn'>
                        Eliminar
                    </button>
                </div>
            </article>
        </>
    )
}
