import './styles.css';

type Props = {
    name: string;
}

export default function ButtonTertiary({name}: Props) {

    return (
        <button className='proj-btn-tertiary'>
            {name}
        </button>
    );
}
