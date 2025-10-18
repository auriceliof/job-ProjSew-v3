import './styles.css';

type Props = {
    name: string;
}

export default function ButtonSecondary({name}: Props) {

    return (
        <button className='proj-btn-secondary'>
            {name}
        </button>
    );
}
