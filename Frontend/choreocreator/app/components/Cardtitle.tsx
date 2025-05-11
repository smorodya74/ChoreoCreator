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
            <p className="card_title">{title}</p>
            <p className="card_author">{author}</p>
        </div>
    );
};