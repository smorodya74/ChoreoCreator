import Modal from "antd/es/modal/Modal";
import { ScenarioRequest } from "../services/scenarios";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import Input from "antd/es/input/Input";
import { Scenario } from "../Models/Scenario";

interface Props{
    mode: Mode;
    values: Scenario;
    isModalOpen: boolean;
    handleCancel: () => void;
    handleCreate: (request: ScenarioRequest) => void;
    handleUpdate: (id: string, request: ScenarioRequest) => void;
}

export enum Mode {
    Create,
    Edit,
}

export const CreateUpdateScenario = ({
    mode,
    values,
    isModalOpen,
    handleCancel,
    handleCreate,
    handleUpdate,
} : Props) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dancerCount, setDancerCount] = useState<number>(1);
    const [author, setAuthor] = useState<string>("Author");

    useEffect(() => {
        setTitle(values.title)
        setDescription(values.description)
        setDancerCount(values.dancerCount=1)
        setAuthor(values.author="Author")
    }, [values]);

    const handleOnOk = async () => {
        const scenarioRequest = { title, description, dancerCount, author };

        mode == Mode.Create
            ? handleCreate(scenarioRequest) 
            : handleUpdate(values.id, scenarioRequest)
    }    

    return (
        <Modal
            title={
                mode === Mode.Create ? "Создать сценарий" : "Редактировать сценарий"
            }
            open={isModalOpen}
            onOk={handleOnOk}
            onCancel={handleCancel}
            cancelText={"Отменить"}
        >
            <div className="scenario_modal">
                <div className="gradient-border-input">
                    <div className="gradient-border-input-inner">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Название"
                        variant="borderless"
                    />
                </div>
                </div>
                <div className="gradient-border-input">
                    <div className="gradient-border-input-inner">
                    <TextArea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        placeholder="Описание"
                        variant="borderless"
                    />
                </div>
                </div>
            </div>
        </Modal>
    )
};