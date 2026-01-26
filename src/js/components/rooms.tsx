export default function RoomsView() {
    return (
        <div className='container-fluid'>
            <div className='row vh-100 pt-2 pb-2'>
                <div className='col col-3'>
                    <ul className='nav nav-pills flex-column'>
                        <li className='nav-item'>
                            <a className='nav-link active' href='#'>Room 1</a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href='#'>Room 2</a>
                        </li>
                        <li className='nav-item'>
                            <a className='nav-link' href='#'>Room 3</a>
                        </li>
                    </ul>
                </div>
                <div className='col-9'>
                    Content go here.
                </div>
            </div>
        </div>
    )
}