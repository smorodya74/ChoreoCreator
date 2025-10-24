import { Col, Row } from "antd";

export default function PricesPage() {
    return (
        <>
            <div className="home-container">
                <div className="glass-panel">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <div className="priceCard">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="priceCard">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="priceCard">col-6</div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="priceCard">col-6</div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}