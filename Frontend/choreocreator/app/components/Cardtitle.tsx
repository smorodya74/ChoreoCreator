interface Props {
    title: string;
    author: string;
}

export const CardTitle = ({title, author}: Props) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <p className="card__title">{title}</p>
            <p className="card__author">{author}</p>
        </div>
    );
};