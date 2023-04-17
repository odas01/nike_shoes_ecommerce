import { Link } from 'react-router-dom';

function Card({ data, size = 16 }) {
    return (
        <Link to={`/d/${data.slug}`} className="flex-column group hover:text-inherit">
            <div className="aspect-square rounded-lg overflow-hidden">
                <img
                    className="transition-all duration-300 scale-100 group-hover:scale-105"
                    src={data.thumbnail.url}
                    alt={data.title}
                />
            </div>
            <div className="flex-column py-4 max-h-[132px]">
                <span className="font-semibold text-dots" style={{ fontSize: size }}>
                    {data.title}
                </span>
                <span className="mb-3" style={{ fontSize: size - 4 }}>
                    {data.subTitle}
                </span>
                <span className="text-red-500 font-medium mt-auto" style={{ fontSize: size }}>
                    {data.price.toLocaleString('de-DE')}đ
                </span>
            </div>
        </Link>
    );
}

export default Card;
