import Modal from "antd/es/modal/Modal";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import Input from "antd/es/input/Input";
import { ScenarioRequest } from "../Models/Types";

interface Props{
    mode: Mode;
    values: ScenarioRequest & { id?: string };
    isModalOpen: boolean;
    handleCancel: () => void;
    handleCreate: (request: ScenarioRequest) => void;
    handleUpdate: (id: string, request: ScenarioRequest) => void;
}

export enum Mode {
    Save,
    Publish,
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

    useEffect(() => {
        setTitle(values.title || "");
        setDescription(values.description || "");
        setDancerCount(values.dancerCount || 1);
    }, [values]);

    const handleOnOk = async () => {
        const scenarioRequest: ScenarioRequest = {
            title,
            description,
            dancerCount,
            formations: values.formations,
            isPublished: mode === Mode.Publish,
        };

        if (!values.id) {
            handleCreate(scenarioRequest);
        } else {
            handleUpdate(values.id, scenarioRequest);
        }
    };    

    return (
        <Modal
            title={ mode === Mode.Save ? "Создать сценарий" : "Опубликовать сценарий" }
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