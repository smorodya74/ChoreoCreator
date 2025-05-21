import Modal from "antd/es/modal/Modal";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import Input from "antd/es/input/Input";

interface ScenarioCreateRequest {
    title: string;
    description: string;
}

interface Props {
    isModalOpen: boolean;
    handleCancel: () => void;
    handleCreate: (request: ScenarioCreateRequest) => void;
}

export const CreateUpdateScenario = ({
    isModalOpen,
    handleCancel,
    handleCreate,
}: Props) => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleOnOk = () => {
        const request: ScenarioCreateRequest = {
            title,
            description,
        };

        handleCreate(request);
        setTitle("");
        setDescription("");
    };

    return (
        <Modal
            title="Создать сценарий"
            open={isModalOpen}
            onOk={handleOnOk}
            onCancel={() => {
                handleCancel();
                setTitle("");
                setDescription("");
            }}
            cancelText="Отменить"
            okText="Создать"
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
    );
};