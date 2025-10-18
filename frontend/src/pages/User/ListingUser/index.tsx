import './styles.css';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import editIcon from '../../../assets/pencil.svg';
import viewIcon from '../../../assets/view.svg';
import deleteIcon from '../../../assets/trash.svg';
import ButtonPrimary from '../../../components/ButtonPrimary';
import DialogConfirmation from '../../../components/DialogConfirmation';
import Pagination from '../../../components/Pagination';
import { UserDTO } from '../../../models/userDto';
import * as UserService from "../../../services/user-service";
import DialogViewUser from '../../../components/DialogView/DialogViewUser';

type QueryParams = {
    page: number;
    name: string;
}

export default function ListingUser() {

    const navigate = useNavigate();

    const location = useLocation();

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        User: "",
        message: "Tem certeza que quer deletar esse registro?"
    });
    
    const [queryParams] = useState<QueryParams>({
        page: getActualPage() || 0,
        name: "",
    });

    const [viewUserData, setViewUserData] = useState<{
        visible: boolean;
        user: UserDTO | null;
    }>({
        visible: false,
        user: null,
    });


    const [user, setUser] = useState<UserDTO[]>([])

    const [pageCounts, setPageCounts] = useState();

    const [actualPage, setActualPage] = useState(getActualPage());

    function getActualPage() {
        const params = qs.parse(location.search);
        const page = params.page;
        return page ? Number(page) : 0;
    }

    const handlePageChange = (pageNumber: number) => {
        setActualPage(pageNumber);
        const params = qs.parse(location.search);
        navigate({
            search: qs.stringify({ ...params, page: pageNumber })
        });
    };
      
    useEffect(() => {
        UserService.findPageRequest(actualPage, queryParams.name)
            .then(response => {
                setUser(response.data.content);
                setPageCounts(response.data.totalPages);
            });
    
    }, [actualPage, queryParams.name]);

    function handleNewProduct() {
        navigate("/listingUsers/create")
    };

    function handleUpdate(UserId: number) {
        navigate(`/listingUsers/${UserId}`);
    }

    function handleDelete(UserId: number, Login: string) {
        setDialogConfirmationData(
            { 
                ...dialogConfirmationData, 
                id: UserId, 
                User: Login, 
                visible: true
            }
        );
    }

    function handleDialogConfirmationAnswer(answer: boolean, UserId: number) {
        if (answer) {
            UserService.deleteRequest(UserId)
                .then(() => {
                    setUser([]);
                    window.location.reload()
                })
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visible: false});
    }   
    
    function handleView(user: UserDTO) {
        setViewUserData({visible: true, user})
    }

    function handleCloseView() {
        setViewUserData({visible: false, user: null});
    }

    return (
        <main className='proj-user-listing-card'>
            <section id="proj-user-listing-section" className="proj-container">
                <div className="proj-mt20">
                    <div className='proj-user-listing-title'>
                        <h2>Listagem de Usuários do Sistema</h2>
                    </div>

                    <div className="proj-mt40 proj-mb20">
                        <div className="proj-user-listing-btn" onClick={handleNewProduct}>
                            <ButtonPrimary name='Novo' />
                        </div>
                    </div>

                    <table className="proj-user-listing-table proj-mb20 proj-mt20">
                        <thead>
                            <tr>
                            <th className='proj-user-listing-table-id'>ID</th>
                            <th>LOGIN</th>
                            <th>NOME</th>
                            <th>CPF</th>
                            <th>E-MAIL</th>
                            <th>PERMISSÕES</th>
                            <th></th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map(user => (
                            <tr key={user.id}>
                                <td className='proj-user-listing-table-id'>{user.id}</td>
                                <td>{user.login}</td>
                                <td>{user.name}</td>
                                <td>{user.cpf}</td>
                                <td>{user.email}</td>
                               <td>
                                    <ul>
                                        {user.roles.map((role, index) => (
                                        <li key={index}>{role.authority}</li> ))}
                                    </ul>
                                </td>
                                <td>
                                <img 
                                    src={viewIcon} 
                                    alt='Visualizar' 
                                    onClick={() => handleView(user)} 
                                />
                                </td>
                                <td>
                                <img 
                                    src={editIcon} 
                                    alt='Editar' 
                                    onClick={() => handleUpdate(Number(user.id))} 
                                />
                                </td>
                                <td>
                                <img 
                                    src={deleteIcon} 
                                    alt='Deletar' 
                                    onClick={() => handleDelete(Number(user.id), user.name)} 
                                />
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="proj-user-listing-pagination">
                        <Pagination 
                            pageCount={Number((pageCounts) ? pageCounts : 0)}
                            range={3}
                            onChange={handlePageChange}
                        />                        
                    </div>
                </div>

            </section>
            
            {dialogConfirmationData.visible &&
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    user={dialogConfirmationData.User}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }
            {viewUserData.visible &&
                <DialogViewUser 
                    visible={viewUserData.visible}
                    user={viewUserData.user}
                    onClose={handleCloseView}
                />
            }    

        </main>
    )
}
