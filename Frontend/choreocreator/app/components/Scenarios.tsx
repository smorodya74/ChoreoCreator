import Card from "antd/es/card/Card";
import {CardTitle} from "./Cardtitle";
import Button from "antd/es/button/button";

interface Props {
    scenarios: Scenario[];
    handleDelete: (id: string) => void;
    handleOpen: (scenario: Scenario) => void;
}

export const Scenarios = ({scenarios, handleDelete, handleOpen}: Props) => {
    return (
        <div className="cards" >
            {scenarios.map((scenario : Scenario) => (
                <Card
                    key={scenario.id} 
                    title={<CardTitle title={scenario.title} author={scenario.author}/>} 
                    variant="borderless"
                >
                    <p>{scenario.description}</p>
                    <p>{scenario.dancerCount}</p>
                    <div className="card_buttons">
                        <Button 
                            onClick={() => handleOpen(scenario)}
                            style={{flex: 1}}
                        >
                            Редактировать
                        </Button>
                        <Button 
                            onClick={() => handleDelete(scenario.id)}
                            danger
                            style={{flex: 1}}
                        >
                            Удалить
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}