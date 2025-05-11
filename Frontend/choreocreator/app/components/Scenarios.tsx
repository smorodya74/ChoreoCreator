import Card from "antd/es/card/Card";
import {CardTitle} from "./Cardtitle";
import Button from "antd/es/button/button";

interface Props {
    scenarios: Scenario[]
}

export const Scenarios = ({scenarios}: Props) => {
    return (
        <div className="cards">
            {scenarios.map((scenario : Scenario) => (
                <Card 
                    key={scenario.id} 
                    title={<CardTitle title={scenario.title} author={scenario.author}/>} 
                    //variant="borderless"
                >
                    <p>{scenario.description}</p>
                    <p>{scenario.dancerCount}</p>
                    <div className="card__buttons">
                        <Button>Редактировать</Button>
                        <Button>Удалить</Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}