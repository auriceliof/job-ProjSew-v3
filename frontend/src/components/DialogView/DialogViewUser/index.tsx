import { UserDTO } from '../../../models/userDto';
import { formatCPF } from '../../../utils/format'
import './styles.css';

type Props = {
  visible: boolean;
  user: UserDTO | null;
  onClose: () => void;
};

export default function DialogViewUser({ visible, user, onClose }: Props) {
  if (!visible || !user) return null;

  return (
    <div className="proj-dialog-user-overlay">
      <div className="proj-dialog-user-box">
        <h2>Usuário</h2>

        <div className="proj-dialog-user-content">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Login:</strong> {user.login}</p>
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>E-mail:</strong> {user.email}</p>
          <p><strong>CPF:</strong> {formatCPF(user.cpf)}</p>

          {user.roles && user.roles.length > 0 ? (
            <div className='proj-dialog-user-content-authority'>
              <strong>Permissões</strong>
              <ul>
                {user.roles.map((role, index) => (
                  <li key={index}>{role.authority}</li>
                ))}
              </ul>
            </div>
          ):(
            <p><strong>Permissões:</strong> Nenhum</p>
          )} 
        </div>

        <div className="proj-dialog-user-actions">
          <button type="button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
